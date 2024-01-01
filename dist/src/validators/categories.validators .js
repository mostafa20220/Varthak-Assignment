"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchCategory = exports.postCategory = exports.deleteCategory = exports.getCategory = exports.getUserCategories = void 0;
const express_validator_1 = require("express-validator");
const categoryIdValidator = [
    (0, express_validator_1.param)("categoryId")
        .exists()
        .isString()
        .withMessage("Invalid Category Id")
        .isMongoId()
        .withMessage("Invalid Category Id"),
];
exports.getUserCategories = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page should be positive integer"),
    (0, express_validator_1.query)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("limit should be positive integer"),
];
exports.getCategory = categoryIdValidator;
exports.deleteCategory = categoryIdValidator;
exports.postCategory = [
    (0, express_validator_1.body)("name")
        .trim()
        .isString()
        .withMessage("Invalid Request Body, 'name' should be string")
        .notEmpty()
        .withMessage("Invalid Request Body, 'name' should be provided"),
    (0, express_validator_1.body)("description")
        .trim()
        .isString()
        .withMessage("Invalid Request Body, 'description' should be string")
        .notEmpty()
        .withMessage("Invalid Request Body, 'description' should be provided"),
];
exports.patchCategory = [
    ...categoryIdValidator,
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isString()
        .withMessage("Invalid Request Body, 'name' should be string"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isString()
        .withMessage("Invalid Request Body, 'description' should be string"),
];
