"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getUserCategories = void 0;
const asyncWrapper_1 = require("../middlewares/asyncWrapper");
const categories_model_1 = require("../models/categories.model");
const helpers_1 = require("../utils/helpers");
const AppError_1 = require("../utils/AppError");
const products_model_1 = require("../models/products.model");
exports.getUserCategories = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const page = +(req?.query?.page ?? 1);
    const limit = +(req?.query?.limit ?? 10);
    const include_products = req?.query?.include_products;
    const categories = await categories_model_1.categoriesModel
        .find({ createdBy: userId }, { __v: false, createdBy: false })
        .limit(limit)
        .skip((page - 1) * limit);
    // if include_products is 1, then include every category with its products
    if (include_products === "1") {
        const categoriesWithProducts = await Promise.all(categories.map(async (category) => {
            const products = await products_model_1.productsModel.find({ category: category._id }, { __v: false, createdBy: false, category: false });
            return { ...category.toObject(), products };
        }));
        return res.json((0, helpers_1.createRes)("success", { categories: categoriesWithProducts }));
    }
    res.json((0, helpers_1.createRes)("success", { categories }));
});
exports.getCategory = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const categoryId = req.params.categoryId;
    const category = await categories_model_1.categoriesModel.findOne({ _id: categoryId, createdBy: userId }, { __v: false, createdBy: false });
    if (!category)
        return next(new AppError_1.AppError(404, "fail", "Category Not Found"));
    res.json((0, helpers_1.createRes)("success", { category }));
});
exports.createCategory = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const { name, description } = req.body;
    console.log("userId: ", userId);
    const foundCategory = await categories_model_1.categoriesModel.findOne({
        name,
        createdBy: userId,
    });
    if (foundCategory)
        return next(new AppError_1.AppError(400, "fail", "Category Already Exists"));
    const category = await categories_model_1.categoriesModel.create({ name, description, createdBy: userId });
    res.status(201).json((0, helpers_1.createRes)("success", { category }));
});
exports.updateCategory = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const categoryId = req?.params?.categoryId;
    const { name, description } = req.body;
    if (name === undefined && description === undefined)
        return next(new AppError_1.AppError(400, "fail", "Invalid Request Body"));
    const category = {};
    if (name !== undefined)
        category.name = name;
    if (description !== undefined)
        category.description = description;
    const newCategory = await categories_model_1.categoriesModel.findOneAndUpdate({ _id: categoryId, createdBy: userId }, category, { new: true });
    console.log("categoryId: ", categoryId);
    console.log("userId: ", userId);
    console.log("newCategory: ", newCategory);
    if (!newCategory)
        return next(new AppError_1.AppError(404, "fail", "Category Not Found"));
    delete newCategory.createdBy;
    delete newCategory.__v;
    res.json((0, helpers_1.createRes)("success", { category: newCategory }));
});
exports.deleteCategory = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const categoryId = req.params.categoryId;
    const deletedCategory = await categories_model_1.categoriesModel.findOneAndDelete({ _id: categoryId, createdBy: userId }, { __v: false, createdBy: false });
    if (!deletedCategory)
        return next(new AppError_1.AppError(404, "fail", "Category Not Found"));
    // delete all the products in the category
    const deletedProducts = await products_model_1.productsModel.deleteMany({
        category: categoryId,
    });
    delete deletedCategory.createdBy;
    delete deletedCategory.__v;
    res.json((0, helpers_1.createRes)("success", { deletedCategory, deletedProducts }));
});
