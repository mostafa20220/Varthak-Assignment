require("dotenv").config();
import express from "express";

import { connectMongoose } from "./src/config/mongoose";
import { createHttpServer, createHttpsServer } from "./src/config/server";
import { configureMiddlewares } from "./src/config/middlewares";

import { productsRouter } from "./src/routers/products.router";
import { categoriesRouter } from "./src/routers/categories.router";
import { authRouter } from "./src/routers/auth.router";

import { handleFallbackRoute, handleGlobalError } from "./src/utils/errorHandling";

const app = express();
// const server = createHttpsServer(app);
const server = createHttpServer(app);

connectMongoose();
configureMiddlewares(app);


// Routers
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);


// Wrong routers handler
app.all("*", handleFallbackRoute );

// Global error handler
app.use(handleGlobalError);


// Launch the server
const port = process.env.PORT ?? 8080;
server.listen(port, () => {
  console.log("The Server is Listening on port: " + port);
});
