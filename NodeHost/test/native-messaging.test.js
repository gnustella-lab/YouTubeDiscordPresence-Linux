const assert = require("node:assert/strict");
const test = require("node:test");

const {
    NativeMessageParser,
    encodeNativeMessage
} = require("../src/native-messaging");

test("encodes a UTF-8 native message with its byte length", () => {
    const frame = encodeNativeMessage({ title: "Música" });
    assert.equal(frame.readUInt32LE(0), frame.length - 4);
    assert.deepEqual(JSON.parse(frame.subarray(4).toString("utf8")), { title: "Música" });
});

test("parses a message split across multiple chunks", () => {
    const messages = [];
    const parser = new NativeMessageParser((message) => messages.push(message));
    const frame = encodeNativeMessage({ getNativeVersion: true });

    parser.push(frame.subarray(0, 2));
    parser.push(frame.subarray(2, 7));
    parser.push(frame.subarray(7));

    assert.deepEqual(messages, [{ getNativeVersion: true }]);
});

test("parses multiple messages received in one chunk", () => {
    const messages = [];
    const parser = new NativeMessageParser((message) => messages.push(message));
    parser.push(Buffer.concat([
        encodeNativeMessage({ sequence: 1 }),
        encodeNativeMessage({ sequence: 2 })
    ]));

    assert.deepEqual(messages, [{ sequence: 1 }, { sequence: 2 }]);
});

test("rejects messages larger than the configured limit", () => {
    const parser = new NativeMessageParser(() => {}, 8);
    const header = Buffer.alloc(4);
    header.writeUInt32LE(9, 0);
    assert.throws(() => parser.push(header), RangeError);
});
