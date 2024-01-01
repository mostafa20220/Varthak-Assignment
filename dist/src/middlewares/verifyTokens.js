"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../utils/AppError");
const verifyTokens = (req, res, next) => {
    const authHeader = (req.headers.authorization ??
        req.headers.Authorization);
    const ACCESS_TOKEN = authHeader?.split(" ")[1];
    if (!ACCESS_TOKEN)
        return next(new AppError_1.AppError(401, "fail", "Access Token is Required"));
    const REFRESH_TOKEN = req.cookies?.REFRESH_TOKEN;
    if (!REFRESH_TOKEN)
        return next(new AppError_1.AppError(401, "fail", "REFRESH_TOKEN is Required"));
    let decodedRefreshToken;
    try {
        decodedRefreshToken = jsonwebtoken_1.default.verify(REFRESH_TOKEN, process.env.JWT_SECRET);
        // renew the token
        delete decodedRefreshToken.iat;
        delete decodedRefreshToken.exp;
    }
    catch (err) {
        return next(new AppError_1.AppError(401, "fail", "Invalid Refresh Token"));
    }
    let decodedAccessToken;
    try {
        decodedAccessToken = jsonwebtoken_1.default.verify(ACCESS_TOKEN, process.env.JWT_SECRET);
        // renew the token
        delete decodedAccessToken.iat;
        delete decodedAccessToken.exp;
    }
    catch (err) {
        return next(new AppError_1.AppError(401, "fail", "Invalid Access Token"));
    }
    if (JSON.stringify(decodedAccessToken) !== JSON.stringify(decodedRefreshToken))
        return next(new AppError_1.AppError(401, "fail", "Invalid Tokens"));
    req.payload = decodedAccessToken;
};
exports.verifyTokens = verifyTokens;
