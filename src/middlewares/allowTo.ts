import { NextFunction, Response } from "express";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../types/types";
import { UserRole, ALL } from "../config/roles";
import { verifyTokens } from "./verifyTokens";

export const allowTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    verifyTokens(req, res, next);

    const user = req?.payload;

    // console.log("from verify, user: ", user);

    if (!user)
      return next(new AppError(401, "fail", "req.payload is undefined"));

    // user has many roles, so we need to check if the user has at least one of the required roles
    let hasAccess = false;
    if (roles.includes(ALL)) hasAccess = true;
    else
      roles.forEach((role) => {
        if (user.roles.includes(role)) hasAccess = true;
      });

    if (!hasAccess)
      return next(
        new AppError(403, "fail", "You are not authorized to do this action")
      );

    next();
  };
};
