"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validator = __importStar(require("../validators/auth.validators"));
const controller = __importStar(require("../controllers/auth.controller"));
const allowTo_1 = require("../middlewares/allowTo");
const verifyRefreshToken_1 = require("../middlewares/verifyRefreshToken");
const roles_1 = require("../config/roles");
exports.authRouter = (0, express_1.Router)();
// TODO:
//! fix that user is (registered) even if validation fails (roles validation) 
exports.authRouter
    .route("/register")
    .post(validator.register, controller.register);
exports.authRouter
    .route("/login")
    .post(validator.login, controller.login);
exports.authRouter
    .route("/token")
    .get(verifyRefreshToken_1.verifyRefreshToken, validator.refresh, controller.refreshAccessToken);
exports.authRouter
    .route("/logout")
    .delete((0, allowTo_1.allowTo)(roles_1.ALL), controller.logout);
