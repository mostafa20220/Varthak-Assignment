import { body, header, cookie } from "express-validator";
import { UserRole } from "../config/roles";

export const register = [
  body("name")
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'name' should be string")
    .notEmpty()
    .withMessage("Invalid Request Body, 'name' should be provided"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Request Body, 'email' should be valid email")
    .notEmpty()
    .withMessage("Invalid Request Body, 'email' should be provided"),

  body("password")
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'password' should be string")
    .notEmpty()
    .withMessage("Invalid Request Body, 'password' should be provided")
    .isLength({ min: 4 }),

  body("roles")
    .isArray()
    .withMessage("Invalid Request Body, 'roles' should be array")
    .notEmpty()
    .withMessage("Invalid Request Body, 'roles' should be provided")
    .custom((roles: UserRole[]) => {
      return roles.length && roles.every((role) => Object.values(UserRole).includes(role));
    })
    .withMessage(
      "Invalid Request Body, 'roles' should be array of valid roles"
    ),
];

export const login = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Request Body, 'email' should be valid email")
    .notEmpty()
    .withMessage("Invalid Request Body, 'email' should be provided"),
  body("password")
    .trim()
    .isString()
    .withMessage("Invalid Request Body, 'password' should be string")
    .notEmpty()
    .withMessage("Invalid Request Body, 'password' should be provided")
    .isLength({ min: 4 }),
];

export const refresh = [
  cookie("REFRESH_TOKEN")
    .exists()
    .withMessage("Invalid Request, 'REFRESH_TOKEN' should be provided"),
];

export const logout = [
  header("Authorization")
    .exists()
    .withMessage("Invalid Request, 'Authorization' header should be provided"),
];
