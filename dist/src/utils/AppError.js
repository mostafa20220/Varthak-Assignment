"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    code;
    statusText;
    constructor(code, statusText, message) {
        super();
        this.code = code;
        this.statusText = statusText;
        this.message = Array.isArray(message) ? message.map((error) => error.msg).join(", ") : message;
    }
}
exports.AppError = AppError;
