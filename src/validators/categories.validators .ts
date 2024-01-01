import { param, body, query } from "express-validator";

const categoryIdValidator = [
  param("categoryId")
    .exists()
    .isString()
    .withMessage("Invalid Category Id")
    .isMongoId()
    .withMessage("Invalid Category Id"),
];

export const getUserCategories = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page should be positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit should be positive integer"),
];

export const getCategory = categoryIdValidator;

export const deleteCategory = categoryIdValidator;

export const postCategory = [
  body("name")
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'name' should be string")
    .notEmpty()
    .withMessage("Invalid Request Body, 'name' should be provided"),
  body("description")
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'description' should be string")
    .notEmpty()
    .withMessage("Invalid Request Body, 'description' should be provided"),
];

export const patchCategory = [
  ...categoryIdValidator,
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'name' should be string"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'description' should be string"),
];
