import express from "express";

import * as validator from "../validators/categories.validators ";
import * as controller from "../controllers/categories.controller";
import { allowTo } from "../middlewares/allowTo";
import { UserRole } from "../config/roles";

export const categoriesRouter = express.Router();

categoriesRouter
.route("/")
  .get(validator.getUserCategories,allowTo(UserRole.CREATE_CATEGORY), controller.getUserCategories)
  .post(validator.postCategory,allowTo(UserRole.CREATE_CATEGORY), controller.createCategory);

categoriesRouter
.route("/:categoryId")
  .get(validator.getCategory, allowTo(UserRole.CREATE_CATEGORY), controller.getCategory)
  .patch(validator.patchCategory,allowTo(UserRole.UPDATE_CATEGORY), controller.updateCategory)
  .delete(validator.deleteCategory,allowTo(UserRole.DELETE_CATEGORY), controller.deleteCategory);
