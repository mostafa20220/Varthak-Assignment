"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.productsRouter = express_1.default.Router();
exports.productsRouter
    .route("/");
// .post(allowTo("user"), validator.postCity, controller.postCity);
exports.productsRouter
    .route("/:cityId");
// .get(allowTo("user"), validator.getCity, controller.getCity)
// .patch(allowTo("user"), validator.patchCity, controller.patchCity)
// .delete(allowTo("user"), validator.deleteCity, controller.deleteCity);
