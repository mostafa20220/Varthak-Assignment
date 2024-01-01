import { Router } from "express";
import * as validator from "../validators/auth.validators";
import * as controller from "../controllers/auth.controller";
import { allowTo } from "../middlewares/allowTo";
import { verifyRefreshToken } from "../middlewares/verifyRefreshToken";
import { ALL } from "../config/roles";

export const authRouter = Router();

// TODO:
//! fix that user is (registered) even if validation fails (roles validation) 

authRouter
  .route("/register")
  .post(validator.register, controller.register);

authRouter
  .route("/login")
  .post(validator.login, controller.login);
  
authRouter
  .route("/token")
  .get(verifyRefreshToken, validator.refresh, controller.refreshAccessToken);

authRouter
  .route("/logout")
  .delete(allowTo(ALL), controller.logout);
