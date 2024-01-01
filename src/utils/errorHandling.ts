import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { createRes } from "./helpers";
import { AppError } from "./AppError";

export const handleFallbackRoute = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json(createRes("fail", "Resource Not Available"));
  next();
};

export const handleGlobalError = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  fs.appendFileSync(
    "errors.log",
    new Date().toLocaleString() + "\t" + err.message + "\n"
  );
  console.log(`${new Date().toLocaleString()}:=>  ${err}`);
  const code = err.code && err.code >= 100 && err.code < 600 ? err.code : 500;
  res
    .status(code)
    .json(createRes(err.statusText || "error", err.message, code));
};
