const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const installer = path.resolve(__dirname, "../scripts/install-linux.sh");

test("installs and removes user-level Chromium-family and Helium manifests", (t) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "ytdp-linux-test-"));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));

    const fakeHost = path.join(root, "fake-host");
    fs.writeFileSync(fakeHost, "#!/bin/sh\nexit 0\n", { mode: 0o755 });

    const env = {
        ...process.env,
        HOME: root,
        XDG_CONFIG_HOME: path.join(root, "config"),
        XDG_DATA_HOME: path.join(root, "data")
    };

    execFileSync("sh", [installer, "--host-path", fakeHost], { env });

    for (const profile of ["google-chrome", "chromium", "google-chrome-for-testing", "net.imput.helium"]) {
        const manifestPath = path.join(
            env.XDG_CONFIG_HOME,
            profile,
            "NativeMessagingHosts",
            "com.ytdp.discord.presence.json"
        );
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        assert.equal(manifest.name, "com.ytdp.discord.presence");
        assert.equal(manifest.path, path.join(env.XDG_DATA_HOME, "youtube-discord-presence", "ytdp-native-host"));
        assert.deepEqual(manifest.allowed_origins, [
            "chrome-extension://hnmeidgkfcbpjjjpmjmpehjdljlaeaaa/"
        ]);
    }

    execFileSync("sh", [installer, "--uninstall"], { env });
    assert.equal(fs.existsSync(path.join(env.XDG_DATA_HOME, "youtube-discord-presence")), false);
});
