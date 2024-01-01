import { Request } from "express";
import { UserRole } from "../config/roles";


export type User = {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
  REFRESH_TOKEN?: string;
};

export type Category = {
  _id?: string;
  name?: string;
  description?: string;
};

export type Product = {
  _id?: string;
  name?: string;
  price?: number;
  description?: string;
  countInStock?: number;
  category: Category;
};

type Payload = { id: string; roles: UserRole[] };

export interface AuthRequest extends Request {
  payload?: Payload;
}
