const DEFAULT_MAX_MESSAGE_SIZE = 64 * 1024 * 1024;

function encodeNativeMessage(payload) {
    const body = Buffer.from(JSON.stringify(payload), "utf8");
    const header = Buffer.allocUnsafe(4);
    header.writeUInt32LE(body.length, 0);
    return Buffer.concat([header, body]);
}

class NativeMessageParser {
    constructor(onMessage, maxMessageSize = DEFAULT_MAX_MESSAGE_SIZE) {
        if (typeof onMessage !== "function") {
            throw new TypeError("onMessage must be a function");
        }

        this.onMessage = onMessage;
        this.maxMessageSize = maxMessageSize;
        this.buffer = Buffer.alloc(0);
    }

    push(chunk) {
        if (!Buffer.isBuffer(chunk)) {
            chunk = Buffer.from(chunk);
        }

        this.buffer = this.buffer.length === 0
            ? chunk
            : Buffer.concat([this.buffer, chunk]);

        while (this.buffer.length >= 4) {
            const payloadSize = this.buffer.readUInt32LE(0);
            if (payloadSize > this.maxMessageSize) {
                this.buffer = Buffer.alloc(0);
                throw new RangeError(`Native message exceeds ${this.maxMessageSize} bytes`);
            }

            const frameSize = payloadSize + 4;
            if (this.buffer.length < frameSize) return;

            const payload = this.buffer.subarray(4, frameSize);
            this.buffer = this.buffer.subarray(frameSize);
            this.onMessage(JSON.parse(payload.toString("utf8")));
        }
    }
}

module.exports = {
    DEFAULT_MAX_MESSAGE_SIZE,
    NativeMessageParser,
    encodeNativeMessage
};
