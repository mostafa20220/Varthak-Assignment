import mongoose from "mongoose";
import validator from "validator";
import { UserRole } from "../config/roles";
const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    validate: [validator.isEmail, "Invalid Email"],
  },
  password: { type: String, required: true },
  roles: { type: [String], required: true, enum: Object.values(UserRole) },
  REFRESH_TOKEN: { type: String },
});

export const userModel = mongoose.model("User", usersSchema);
