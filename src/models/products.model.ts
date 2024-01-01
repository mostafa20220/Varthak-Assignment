import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: { type : String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  countInStock: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const productsModel = mongoose.model("Product", productsSchema);
