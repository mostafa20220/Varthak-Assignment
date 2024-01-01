import express from "express";
import * as validator from "../validators/products.validators";
import * as controller from "../controllers/products.controller";
import { allowTo } from "../middlewares/allowTo";
import { UserRole } from "../config/roles";

export const productsRouter = express.Router();

productsRouter
  .route("/")
  .get(validator.getUserProducts, allowTo(UserRole.CREATE_PRODUCT), controller.getUserProducts)
  .post(validator.postProduct, allowTo(UserRole.CREATE_PRODUCT), controller.createProduct);

productsRouter
  .route("/:productId")
  .get(validator.getProduct, allowTo(UserRole.CREATE_PRODUCT), controller.getProduct)
  .patch(validator.patchProduct, allowTo(UserRole.UPDATE_PRODUCT), controller.updateProduct)
  .delete(validator.deleteProduct, allowTo(UserRole.DELETE_PRODUCT), controller.deleteProduct);
