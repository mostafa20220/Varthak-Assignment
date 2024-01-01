"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobalError = exports.handleFallbackRoute = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const handleFallbackRoute = (req, res, next) => {
    res.status(404).json((0, helpers_1.createRes)("fail", "Resource Not Available"));
    next();
};
exports.handleFallbackRoute = handleFallbackRoute;
const handleGlobalError = (err, req, res, next) => {
    fs_1.default.appendFileSync("errors.log", new Date().toLocaleString() + "\t" + err.message + "\n");
    console.log(`${new Date().toLocaleString()}:=>  ${err}`);
    const code = err.code && err.code >= 100 && err.code < 600 ? err.code : 500;
    res
        .status(code)
        .json((0, helpers_1.createRes)(err.statusText || "error", err.message, code));
};
exports.handleGlobalError = handleGlobalError;
