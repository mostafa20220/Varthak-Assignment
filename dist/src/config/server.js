"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpsServer = exports.createHttpServer = void 0;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createHttpServer = (app) => {
    return http_1.default.createServer(app);
};
exports.createHttpServer = createHttpServer;
const createHttpsServer = (app) => {
    const key = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../../certs/key.pem"));
    const cert = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../../certs/cert.pem"));
    return https_1.default.createServer({ key, cert }, app);
};
exports.createHttpsServer = createHttpsServer;
