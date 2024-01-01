import mongoose from "mongoose";

export const connectMongoose = async () => {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  if (!uri) throw new Error("MongoDB Connection String Not Provided");

  try {
    await mongoose.connect(uri);
    console.log("mongoose is connected successfully");
  } catch (err) {
    console.error("Failed to connect to mongoDB, \nError:\n", err);
  }
};
