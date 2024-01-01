"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCategories = void 0;
const asyncWrapper_1 = require("../middlewares/asyncWrapper");
const categories_model_1 = require("../models/categories.model");
exports.getUserCategories = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    // const page = +req?.query?.page || 1;
    // const limit = +req?.query?.limit ?? 10;
    const categories = await categories_model_1.categoriesModel.find();
    // .limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    res.status(200).json({ categories });
});
