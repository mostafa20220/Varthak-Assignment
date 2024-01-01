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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = __importDefault(require("express"));
const validator = __importStar(require("../validators/products.validators"));
const controller = __importStar(require("../controllers/products.controller"));
const allowTo_1 = require("../middlewares/allowTo");
const roles_1 = require("../config/roles");
exports.productsRouter = express_1.default.Router();
exports.productsRouter
    .route("/")
    .get(validator.getUserProducts, (0, allowTo_1.allowTo)(roles_1.UserRole.CREATE_PRODUCT), controller.getUserProducts)
    .post(validator.postProduct, (0, allowTo_1.allowTo)(roles_1.UserRole.CREATE_PRODUCT), controller.createProduct);
exports.productsRouter
    .route("/:productId")
    .get(validator.getProduct, (0, allowTo_1.allowTo)(roles_1.UserRole.CREATE_PRODUCT), controller.getProduct)
    .patch(validator.patchProduct, (0, allowTo_1.allowTo)(roles_1.UserRole.UPDATE_PRODUCT), controller.updateProduct)
    .delete(validator.deleteProduct, (0, allowTo_1.allowTo)(roles_1.UserRole.DELETE_PRODUCT), controller.deleteProduct);
