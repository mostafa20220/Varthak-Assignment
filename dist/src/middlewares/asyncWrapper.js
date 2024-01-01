"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const express_validator_1 = require("express-validator");
const AppError_1 = require("../utils/AppError");
function asyncWrapper(fn) {
    return (req, res, next) => {
        //  Request Validation
        const validationErrors = (0, express_validator_1.validationResult)(req);
        if (!validationErrors.isEmpty())
            return next(new AppError_1.AppError(400, "fail", validationErrors.array()));
        // run the controller and catch any runtime errors
        fn(req, res, next).catch((err) => next(err));
    };
}
exports.asyncWrapper = asyncWrapper;
