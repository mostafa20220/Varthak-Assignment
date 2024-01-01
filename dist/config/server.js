"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpsServer = void 0;
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createHttpsServer = (app) => {
    const options = {
        key: fs_1.default.readFileSync(path_1.default.join(__dirname, "certs", "key.pem")),
        cert: fs_1.default.readFileSync("./certs/cert.pem"),
    };
    return https_1.default.createServer(options, app);
};
exports.createHttpsServer = createHttpsServer;
