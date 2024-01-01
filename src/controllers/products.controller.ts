import { NextFunction, Response } from "express";
import { productsModel } from "../models/products.model";
import { createRes } from "../utils/helpers";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { AuthRequest, Product } from "../types/types";
import { AppError } from "../utils/AppError";
import { categoriesModel } from "../models/categories.model";

const prepareToSend = (product: Product) => {
  const { _id, name, description, price, category, countInStock } = product;
  return { _id, name, description, price, category, countInStock };
}

export const getUserProducts = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // pagination
    const page = +(req?.query?.page ?? 1);
    const limit = +(req?.query?.limit ?? 10);

    const userId = req?.payload?.id;

    const products = await productsModel
      .find({ createdBy: userId },{ __v: false, createdBy: false, })
      .limit(limit)
      .skip((page - 1) * limit).populate("category", { __v: false, createdBy: false, });

    res.json(createRes("success", { products }));
  }
);

export const getProduct = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const productId = req.params.productId;

    const product = await productsModel.findOne({
      _id: productId,
      createdBy: userId,
    },{ __v: false, createdBy: false, });

    if (!product) return next(new AppError(404, "fail", "Product Not Found"));

    res.json(createRes("success", { product }));
  }
);

export const createProduct = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const { name, description, price, category, countInStock } = req.body;

    // check if the category exists
    const foundCategory = await categoriesModel.findOne({
      name: category,
      createdBy: userId,
    });

    if (!foundCategory)
      return next(new AppError(404, "fail", "Category Not Valid"));

    let product = (await productsModel.create({
      name,
      description,
      countInStock,
      category: foundCategory.id,
      price,
      createdBy: userId,
    }) ) as unknown as Product;

    product = prepareToSend(product);
    product.category = category;




    res.status(201).json(createRes("success", { product }));
  }
);

export const updateProduct = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const productId = req?.params?.productId;
    const { name, description, price, category, countInStock } = req.body;

    // validate the request body
    if (
      name === undefined &&
      description === undefined &&
      price === undefined &&
      category === undefined &&
      countInStock === undefined
    )
      return next(new AppError(400, "fail", "Invalid Request Body"));

    // create the product object
    const product: Product = {} as Product;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (category !== undefined) {
      
      product.category = category;

      // check if the category exists
      const foundCategory = await categoriesModel.findOne({
        name: category,
        createdBy: userId,
      });

      if (!foundCategory)
        return next(new AppError(404, "fail", "Category Not Valid"));
    }

    let newProduct = await productsModel.findOneAndUpdate(
      { _id: productId, createdBy: userId },
      product,
      { new: true }
    ).populate("category") as unknown as Product;

    console.log("productId: ", productId);
    console.log("userId: ", userId);

    if (!newProduct)
      return next(new AppError(404, "fail", "Product Not Found"));

    newProduct = prepareToSend(newProduct);
      
    res.json(createRes("success", { newProduct }));
  }
);

export const deleteProduct = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const productId = req.params.productId;

    let deletedProduct = await productsModel.findOneAndDelete({
      _id: productId,
      createdBy: userId,
    }) as unknown as Product;

    if (!deletedProduct) return next(new AppError(404, "fail", "Product Not Found"));

    deletedProduct = prepareToSend(deletedProduct);

    res.json(createRes("success", { product: deletedProduct }));
  }
);
