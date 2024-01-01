"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoose = async () => {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    if (!uri)
        throw new Error("MongoDB Connection String Not Provided");
    try {
        await mongoose_1.default.connect(uri);
        console.log("mongoose is connected successfully");
    }
    catch (err) {
        console.error("Failed to connect to mongoDB, \nError:\n", err);
    }
};
exports.connectMongoose = connectMongoose;
