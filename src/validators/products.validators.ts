import { body, param } from "express-validator";

const productIdValidator = [
  param("productId")
    .exists()
    .isString()
    .withMessage("Invalid Product Id")
    .isMongoId()
    .withMessage("Invalid Product Id"),
];

export const getProduct = productIdValidator;

export const deleteProduct = productIdValidator;

export const getUserProducts = [
  body("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page should be positive integer"),
  body("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit should be positive integer"),
];


export const postProduct = [
  body("name")
    .exists()
    .withMessage("name is required")
    .isString()
    .withMessage("name should be a string"),
  body("description")
    .exists()
    .withMessage("description is required")
    .isString()
    .withMessage("description should be a string"),
  body("price")
    .exists()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price should be a number")
    .custom((value) => {
      if (value < 0) throw new Error("price should be positive");
      return true;
    }),
  body("category")
    .exists()
    .withMessage("category is required")
    .isString()
    .withMessage("category should be a string"),
  body("countInStock")
    .exists()
    .withMessage("countInStock is required")
    .isInt({ min: 1, max: 1_000_000 })
    .withMessage("countInStock should be a number"),
];

export const patchProduct = [
  ...productIdValidator,
  body("name").optional().isString().withMessage("name should be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("description should be a string"),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("price should be a number")
    .custom((value) => {
      if (value < 0) throw new Error("price should be positive");
      return true;
    }),
  body("category")
    .optional()
    .isString()
    .withMessage("category should be a string"),
  body("countInStock")
    .optional()
    .isInt({ min: 1, max: 1_000_000 })
    .withMessage("countInStock should be a number"),
];

