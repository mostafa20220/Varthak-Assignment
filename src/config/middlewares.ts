import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

export const configureMiddlewares = (app: express.Application) => {
  app.use(json());
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
};
