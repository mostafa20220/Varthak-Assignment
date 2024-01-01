import { NextFunction, Response } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { categoriesModel } from "../models/categories.model";
import { AuthRequest, Category } from "../types/types";
import { createRes } from "../utils/helpers";
import { AppError } from "../utils/AppError";
import { productsModel } from "../models/products.model";

export const getUserCategories = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const page = +(req?.query?.page ?? 1);
    const limit = +(req?.query?.limit ?? 10);
    const include_products = req?.query?.include_products;

    const categories = await categoriesModel
      .find({ createdBy: userId }, { __v: false, createdBy: false })
      .limit(limit)
      .skip((page - 1) * limit);

    // if include_products is 1, then include every category with its products
    if (include_products === "1") {
      const categoriesWithProducts: Category[] = await Promise.all(
        categories.map(async (category) => {
          const products = await productsModel.find(
            { category: category._id },
            { __v: false, createdBy: false, category: false }
          );
          return { ...category.toObject(), products};
        })
      );

      return res.json(
        createRes("success", { categories: categoriesWithProducts })
      );
    }

    res.json(createRes("success", { categories }));
  }
);

export const getCategory = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const categoryId = req.params.categoryId;

    const category = await categoriesModel.findOne(
      { _id: categoryId, createdBy: userId },
      { __v: false, createdBy: false }
    );

    if (!category) return next(new AppError(404, "fail", "Category Not Found"));

    res.json(createRes("success", { category }));
  }
);

export const createCategory = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const { name, description } = req.body;

    console.log("userId: ", userId);

    const foundCategory = await categoriesModel.findOne({
      name,
      createdBy: userId,
    });

    if (foundCategory)
      return next(new AppError(400, "fail", "Category Already Exists"));

    const category = await categoriesModel.create(
      { name, description, createdBy: userId }  );

    res.status(201).json(createRes("success", { category }));
  }
);

export const updateCategory = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const categoryId = req?.params?.categoryId;
    const { name, description } = req.body;

    if (name === undefined && description === undefined)
      return next(new AppError(400, "fail", "Invalid Request Body"));

    const category: Category = {};
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;

    const newCategory = await categoriesModel.findOneAndUpdate(
      { _id: categoryId, createdBy: userId },
      category,
      { new: true }
    );

    console.log("categoryId: ", categoryId);
    console.log("userId: ", userId);
    console.log("newCategory: ", newCategory);

    if (!newCategory)
      return next(new AppError(404, "fail", "Category Not Found"));

    delete newCategory.createdBy;
    delete newCategory.__v;

    res.json(createRes("success", { category: newCategory }));
  }
);

export const deleteCategory = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req?.payload?.id;
    const categoryId = req.params.categoryId;

    const deletedCategory = await categoriesModel.findOneAndDelete(
      { _id: categoryId, createdBy: userId },
      { __v: false, createdBy: false }
    );

    if (!deletedCategory)
      return next(new AppError(404, "fail", "Category Not Found"));

    // delete all the products in the category
    const deletedProducts = await productsModel.deleteMany({
      category: categoryId,
    });

    delete deletedCategory.createdBy;
    delete deletedCategory.__v;

    res.json(createRes("success", { deletedCategory, deletedProducts }));
  }
);
