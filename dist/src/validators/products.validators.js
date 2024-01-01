"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchProduct = exports.postProduct = exports.getUserProducts = exports.deleteProduct = exports.getProduct = void 0;
const express_validator_1 = require("express-validator");
const productIdValidator = [
    (0, express_validator_1.param)("productId")
        .exists()
        .isString()
        .withMessage("Invalid Product Id")
        .isMongoId()
        .withMessage("Invalid Product Id"),
];
exports.getProduct = productIdValidator;
exports.deleteProduct = productIdValidator;
exports.getUserProducts = [
    (0, express_validator_1.body)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page should be positive integer"),
    (0, express_validator_1.body)("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("limit should be positive integer"),
];
exports.postProduct = [
    (0, express_validator_1.body)("name")
        .exists()
        .withMessage("name is required")
        .isString()
        .withMessage("name should be a string"),
    (0, express_validator_1.body)("description")
        .exists()
        .withMessage("description is required")
        .isString()
        .withMessage("description should be a string"),
    (0, express_validator_1.body)("price")
        .exists()
        .withMessage("price is required")
        .isNumeric()
        .withMessage("price should be a number")
        .custom((value) => {
        if (value < 0)
            throw new Error("price should be positive");
        return true;
    }),
    (0, express_validator_1.body)("category")
        .exists()
        .withMessage("category is required")
        .isString()
        .withMessage("category should be a string"),
    (0, express_validator_1.body)("countInStock")
        .exists()
        .withMessage("countInStock is required")
        .isInt({ min: 1, max: 1000000 })
        .withMessage("countInStock should be a number"),
];
exports.patchProduct = [
    ...productIdValidator,
    (0, express_validator_1.body)("name").optional().isString().withMessage("name should be a string"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("description should be a string"),
    (0, express_validator_1.body)("price")
        .optional()
        .isNumeric()
        .withMessage("price should be a number")
        .custom((value) => {
        if (value < 0)
            throw new Error("price should be positive");
        return true;
    }),
    (0, express_validator_1.body)("category")
        .optional()
        .isString()
        .withMessage("category should be a string"),
    (0, express_validator_1.body)("countInStock")
        .optional()
        .isInt({ min: 1, max: 1000000 })
        .withMessage("countInStock should be a number"),
];
