import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { AuthRequest, Payload } from "../types/types";

export const verifyTokens = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = (req.headers.authorization ??
    req.headers.Authorization) as string;

  const ACCESS_TOKEN = authHeader?.split(" ")[1];
  if (!ACCESS_TOKEN)
    return next(new AppError(401, "fail", "Access Token is Required"));

  const REFRESH_TOKEN = req.cookies?.REFRESH_TOKEN as string;
  if (!REFRESH_TOKEN)
    return next(new AppError(401, "fail", "REFRESH_TOKEN is Required"));

  let decodedRefreshToken;
  try {
    decodedRefreshToken = jwt.verify(
      REFRESH_TOKEN,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    // renew the token
    delete decodedRefreshToken.iat;
    delete decodedRefreshToken.exp;
  } catch (err) {
    return next(new AppError(401, "fail", "Invalid Refresh Token"));
  }

  let decodedAccessToken;
  try {
    decodedAccessToken = jwt.verify(
      ACCESS_TOKEN,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    // renew the token
    delete decodedAccessToken.iat;
    delete decodedAccessToken.exp;
  } catch (err) {
    return next(new AppError(401, "fail", "Invalid Access Token"));
  }

  if (
    JSON.stringify(decodedAccessToken) !== JSON.stringify(decodedRefreshToken)
  )
    return next(new AppError(401, "fail", "Invalid Tokens"));

  req.payload = decodedAccessToken as Payload;
};
