"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const roles_1 = require("../config/roles");
const usersSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator_1.default.isEmail, "Invalid Email"],
    },
    password: { type: String, required: true },
    roles: { type: [String], required: true, enum: Object.values(roles_1.UserRole) },
    REFRESH_TOKEN: { type: String },
});
exports.userModel = mongoose_1.default.model("User", usersSchema);
