"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productsSchema = new mongoose_1.default.Schema({
    name: { String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    countInStock: { type: Number, required: true },
    category: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Category" },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
});
exports.productsModel = mongoose_1.default.model("User", productsSchema);
