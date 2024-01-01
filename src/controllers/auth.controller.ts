import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { userModel } from "../models/users.model";
import { createRes } from "../utils/helpers";
import { AppError } from "../utils/AppError";

import bcrypt from "bcrypt";
import {
  generateToken,
  tokenDurationToString as tokenDurationInSeconds,
} from "../utils/jwt";
import { AuthRequest, Payload, User } from "../types/types";

export const register = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // get data
    const { name, email, password, roles } = req.body;

    // check if the user already exists
    const oldUser = await userModel.findOne({ email });
    if (oldUser)
      next(new AppError(400, "fail", "This Email is Already Registered"));

    // create the new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      roles
    };

    // save the new user to the db
    const addedUser = new userModel(newUser);
    await addedUser.save();

    // generate tokens
    const accessToken = generateToken(
      { id: addedUser._id, roles: addedUser.roles },
      "access"
    );
    const refreshToken = generateToken(
      { id: addedUser._id, roles: addedUser.roles },
      "refresh"
    );

    addedUser.REFRESH_TOKEN = refreshToken;
    await addedUser.save();

    res.cookie("REFRESH_TOKEN", refreshToken, {
      httpOnly: true,
      maxAge: tokenDurationInSeconds("refresh") * 1000,
      secure: true,
      path: "/",
      sameSite: "none",
    });

    const {
      _id,
      name: savedName,
      email: savedMail,
      roles: savedRoles,
    } = addedUser;

    res.json(
      createRes("success", {
        token: accessToken,
        user: {
          _id,
          name: savedName,
          email: savedMail,
          roles: savedRoles,
        },
      })
    );
  }
);

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check if the user already exists
  const user = await userModel.findOne({ email }, { __v: false });
  if (!user) throw new AppError(400, "fail", "Invalid Email or Password");

  // check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "fail", "Invalid Email or Password");

  const accessToken = generateToken(
    { id: user._id, roles: user.roles },
    "access"
  );
  const refreshToken = generateToken(
    { id: user._id, roles: user.roles },
    "refresh"
  );

  user.REFRESH_TOKEN = refreshToken;
  await user.save();

  res.cookie("REFRESH_TOKEN", refreshToken, {
    httpOnly: true,
    maxAge: tokenDurationInSeconds("refresh") * 1000,
    secure: true,
    path: "/",
    sameSite: "none",
  });

  // remove the password, role, and the __v from the user object

  const {
    _id,
    name,
    email: userMail,
    roles,
  } = user;

  res.json(
    createRes("success", {
      token: accessToken,
      user: {
        _id,
        name,
        email: userMail,
        roles,
      },
    })
  );
});

export const logout = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payload = req.payload as Payload;

    if (!payload)
      next(new AppError(400, "fail", "request payload is undefined"));

    const user = await userModel.findOne({ _id: payload.id });
    if (!user) return next(new AppError(404, "fail", "User Not Found"));
    res.clearCookie("REFRESH_TOKEN", { secure: true, sameSite: "none" });
    if (!user?.REFRESH_TOKEN)
      next(new AppError(400, "fail", "User Already Logged Out"));

    user.REFRESH_TOKEN = undefined;
    await user?.save();

    res.json(createRes("success", { message: "User Logged Out" }));
  }
);


// refresh access token controller
export const refreshAccessToken = asyncWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const payload = req.payload as Payload;

    if (!payload)
      next(new AppError(400, "fail", "request payload is undefined"));

    const token = generateToken(payload, "access");
    res.json(createRes("success", { token }));
  }
);
