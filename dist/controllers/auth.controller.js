"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const asyncWrapper_1 = require("../middlewares/asyncWrapper");
const users_model_1 = require("../models/users.model");
const helpers_1 = require("../utils/helpers");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
exports.register = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    // get data
    const { name, email, password, roles } = req.body;
    // check if the user already exists
    const oldUser = await users_model_1.userModel.findOne({ email });
    if (oldUser)
        next(new helpers_1.AppError(400, "fail", "This Email is Already Registered"));
    // create the new user
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = {
        name,
        email,
        password: hashedPassword,
        roles
    };
    // save the new user to the db
    const addedUser = new users_model_1.userModel(newUser);
    await addedUser.save();
    const accessToken = (0, jwt_1.generateToken)({ id: addedUser._id, roles: addedUser.roles }, "access");
    const refreshToken = (0, jwt_1.generateToken)({ id: addedUser._id, roles: addedUser.roles }, "refresh");
    //! is there a way to avoid saving the user twice?
    addedUser.REFRESH_TOKEN = refreshToken;
    await addedUser.save();
    res.cookie("REFRESH_TOKEN", refreshToken, {
        httpOnly: true,
        maxAge: (0, jwt_1.tokenDurationToString)("refresh") * 1000,
        secure: true,
        path: "/",
        sameSite: "none",
    });
    const { _id, name: savedName, email: savedMail, roles: savedRoles, } = addedUser;
    res.json((0, helpers_1.createRes)("success", {
        token: accessToken,
        user: {
            _id,
            name: savedName,
            email: savedMail,
            roles: savedRoles,
        },
    }));
});
exports.login = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { email, password } = req.body;
    // check if the user already exists
    const user = await users_model_1.userModel.findOne({ email }, { __v: false });
    if (!user)
        throw new helpers_1.AppError(400, "fail", "Invalid Email or Password");
    // check if the password is correct
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new helpers_1.AppError(400, "fail", "Invalid Email or Password");
    const accessToken = (0, jwt_1.generateToken)({ id: user._id, roles: user.roles }, "access");
    const refreshToken = (0, jwt_1.generateToken)({ id: user._id, roles: user.roles }, "refresh");
    user.REFRESH_TOKEN = refreshToken;
    await user.save();
    res.cookie("REFRESH_TOKEN", refreshToken, {
        httpOnly: true,
        maxAge: (0, jwt_1.tokenDurationToString)("refresh") * 1000,
        secure: true,
        path: "/",
        sameSite: "none",
    });
    // remove the password, role, and the __v from the user object
    const { _id, name, email: userMail, roles, } = user;
    res.json((0, helpers_1.createRes)("success", {
        token: accessToken,
        user: {
            _id,
            name,
            email: userMail,
            roles,
        },
    }));
});
exports.logout = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const payload = req.payload;
    if (!payload)
        next(new helpers_1.AppError(400, "fail", "request payload is undefined"));
    const user = await users_model_1.userModel.findOne({ _id: payload.id });
    if (!user)
        return next(new helpers_1.AppError(404, "fail", "User Not Found"));
    res.clearCookie("REFRESH_TOKEN", { secure: true, sameSite: "none" });
    if (!user?.REFRESH_TOKEN)
        next(new helpers_1.AppError(400, "fail", "User Already Logged Out"));
    user.REFRESH_TOKEN = undefined;
    await user?.save();
    res.json((0, helpers_1.createRes)("success", { message: "User Logged Out" }));
});
exports.refresh = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const payload = req.payload;
    if (!payload)
        next(new helpers_1.AppError(400, "fail", "request payload is undefined"));
    const user = await users_model_1.userModel.findOne({ _id: payload.id }, { __v: false, password: false, role: false, REFRESH_TOKEN: false });
    if (!user)
        return next(new helpers_1.AppError(404, "fail", "User Not Found"));
    const token = (0, jwt_1.generateToken)(payload, "access");
    res.json((0, helpers_1.createRes)("success", { token, user }));
});
// refresh access token controller
exports.refreshAccessToken = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const payload = req.payload;
    if (!payload)
        next(new helpers_1.AppError(400, "fail", "request payload is undefined"));
    const token = (0, jwt_1.generateToken)(payload, "access");
    res.json((0, helpers_1.createRes)("success", { token }));
});
