"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getUserProducts = void 0;
const products_model_1 = require("../models/products.model");
const helpers_1 = require("../utils/helpers");
const asyncWrapper_1 = require("../middlewares/asyncWrapper");
const AppError_1 = require("../utils/AppError");
const categories_model_1 = require("../models/categories.model");
const prepareToSend = (product) => {
    const { _id, name, description, price, category, countInStock } = product;
    return { _id, name, description, price, category, countInStock };
};
exports.getUserProducts = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    // pagination
    const page = +(req?.query?.page ?? 1);
    const limit = +(req?.query?.limit ?? 10);
    const userId = req?.payload?.id;
    const products = await products_model_1.productsModel
        .find({ createdBy: userId }, { __v: false, createdBy: false, })
        .limit(limit)
        .skip((page - 1) * limit).populate("category", { __v: false, createdBy: false, });
    res.json((0, helpers_1.createRes)("success", { products }));
});
exports.getProduct = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const productId = req.params.productId;
    const product = await products_model_1.productsModel.findOne({
        _id: productId,
        createdBy: userId,
    }, { __v: false, createdBy: false, });
    if (!product)
        return next(new AppError_1.AppError(404, "fail", "Product Not Found"));
    res.json((0, helpers_1.createRes)("success", { product }));
});
exports.createProduct = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const { name, description, price, category, countInStock } = req.body;
    // check if the category exists
    const foundCategory = await categories_model_1.categoriesModel.findOne({
        name: category,
        createdBy: userId,
    });
    if (!foundCategory)
        return next(new AppError_1.AppError(404, "fail", "Category Not Valid"));
    let product = (await products_model_1.productsModel.create({
        name,
        description,
        countInStock,
        category: foundCategory.id,
        price,
        createdBy: userId,
    }));
    product = prepareToSend(product);
    product.category = category;
    res.status(201).json((0, helpers_1.createRes)("success", { product }));
});
exports.updateProduct = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const productId = req?.params?.productId;
    const { name, description, price, category, countInStock } = req.body;
    // validate the request body
    if (name === undefined &&
        description === undefined &&
        price === undefined &&
        category === undefined &&
        countInStock === undefined)
        return next(new AppError_1.AppError(400, "fail", "Invalid Request Body"));
    // create the product object
    const product = {};
    if (name !== undefined)
        product.name = name;
    if (description !== undefined)
        product.description = description;
    if (price !== undefined)
        product.price = price;
    if (countInStock !== undefined)
        product.countInStock = countInStock;
    if (category !== undefined) {
        product.category = category;
        // check if the category exists
        const foundCategory = await categories_model_1.categoriesModel.findOne({
            name: category,
            createdBy: userId,
        });
        if (!foundCategory)
            return next(new AppError_1.AppError(404, "fail", "Category Not Valid"));
    }
    let newProduct = await products_model_1.productsModel.findOneAndUpdate({ _id: productId, createdBy: userId }, product, { new: true }).populate("category");
    console.log("productId: ", productId);
    console.log("userId: ", userId);
    if (!newProduct)
        return next(new AppError_1.AppError(404, "fail", "Product Not Found"));
    newProduct = prepareToSend(newProduct);
    res.json((0, helpers_1.createRes)("success", { newProduct }));
});
exports.deleteProduct = (0, asyncWrapper_1.asyncWrapper)(async (req, res, next) => {
    const userId = req?.payload?.id;
    const productId = req.params.productId;
    let deletedProduct = await products_model_1.productsModel.findOneAndDelete({
        _id: productId,
        createdBy: userId,
    });
    if (!deletedProduct)
        return next(new AppError_1.AppError(404, "fail", "Product Not Found"));
    deletedProduct = prepareToSend(deletedProduct);
    res.json((0, helpers_1.createRes)("success", { product: deletedProduct }));
});
