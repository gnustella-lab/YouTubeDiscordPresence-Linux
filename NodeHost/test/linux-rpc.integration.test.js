const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { NativeMessageParser, encodeNativeMessage } = require("../src/native-messaging");

function encodeDiscordFrame(op, data) {
    const body = Buffer.from(JSON.stringify(data), "utf8");
    const frame = Buffer.allocUnsafe(body.length + 8);
    frame.writeInt32LE(op, 0);
    frame.writeInt32LE(body.length, 4);
    body.copy(frame, 8);
    return frame;
}

function waitFor(predicate, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const deadline = Date.now() + timeoutMs;
        const interval = setInterval(() => {
            if (predicate()) {
                clearInterval(interval);
                resolve();
            }
            else if (Date.now() >= deadline) {
                clearInterval(interval);
                reject(new Error("Timed out waiting for the native host"));
            }
        }, 20);
    });
}

test("updates Discord activity through a Linux Unix socket", async (t) => {
    const runtimeDir = fs.mkdtempSync(path.join(os.tmpdir(), "ytdp-rpc-test-"));
    const socketPath = path.join(runtimeDir, "discord-ipc-0");
    let receivedActivity = null;

    const server = net.createServer((socket) => {
        let buffered = Buffer.alloc(0);
        socket.on("data", (chunk) => {
            buffered = Buffer.concat([buffered, chunk]);
            while (buffered.length >= 8) {
                const op = buffered.readInt32LE(0);
                const size = buffered.readInt32LE(4);
                if (buffered.length < size + 8) return;

                const payload = JSON.parse(buffered.subarray(8, size + 8).toString("utf8"));
                buffered = buffered.subarray(size + 8);

                if (op === 0) {
                    socket.write(encodeDiscordFrame(1, {
                        cmd: "DISPATCH",
                        evt: "READY",
                        data: { user: { id: "1", username: "test" } }
                    }));
                }
                else if (op === 1 && payload.cmd === "SET_ACTIVITY") {
                    receivedActivity = payload.args.activity;
                    socket.write(encodeDiscordFrame(1, {
                        cmd: "SET_ACTIVITY",
                        nonce: payload.nonce,
                        data: {}
                    }));
                }
                else if (op === 2) {
                    socket.end();
                }
            }
        });
    });

    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(socketPath, resolve);
    });

    const hostMessages = [];
    const child = spawn(process.execPath, [path.resolve(__dirname, "../src/app.js")], {
        env: { ...process.env, XDG_RUNTIME_DIR: runtimeDir },
        stdio: ["pipe", "pipe", "pipe"]
    });
    const parser = new NativeMessageParser((message) => hostMessages.push(message));
    child.stdout.on("data", (chunk) => parser.push(chunk));

    t.after(async () => {
        if (child.exitCode === null) child.kill("SIGKILL");
        await new Promise((resolve) => server.close(resolve));
        fs.rmSync(runtimeDir, { recursive: true, force: true });
    });

    await waitFor(() => hostMessages.some(({ data }) => data?.includes("CONNECTED_TO_PIPE_0")));

    child.stdin.write(encodeNativeMessage({
        jsApplicationType: "youtube",
        presenceData: {
            details: "Linux integration test",
            state: "by Codex",
            assets: { large_image: "youtube3" },
            type: 3
        }
    }));

    await waitFor(() => receivedActivity !== null);
    await waitFor(() => hostMessages.some(({ data }) => data?.includes("PRESENCE_UPDATED")));
    assert.equal(receivedActivity.details, "Linux integration test");
    assert.equal(receivedActivity.state, "by Codex");

    child.stdin.end();
    await new Promise((resolve, reject) => {
        child.once("exit", resolve);
        child.once("error", reject);
    });
    assert.equal(child.exitCode, 0);
});
