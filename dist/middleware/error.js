"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ThrowError.ts
class ThrowError extends Error {
    constructor(code, title, message) {
        super(message);
        this.code = code;
        this.title = title;
        Object.setPrototypeOf(this, ThrowError.prototype);
    }
}
exports.default = ThrowError;
