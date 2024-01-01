import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
  name: { type: String, index: true, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const categoriesModel = mongoose.model("Category", categoriesSchema);
