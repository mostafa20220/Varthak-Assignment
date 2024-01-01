"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("./src/config/mongoose");
const server_1 = require("./src/config/server");
const middlewares_1 = require("./src/config/middlewares");
const products_router_1 = require("./src/routers/products.router");
const categories_router_1 = require("./src/routers/categories.router");
const auth_router_1 = require("./src/routers/auth.router");
const errorHandling_1 = require("./src/utils/errorHandling");
const app = (0, express_1.default)();
// const server = createHttpsServer(app);
const server = (0, server_1.createHttpServer)(app);
(0, mongoose_1.connectMongoose)();
(0, middlewares_1.configureMiddlewares)(app);
// Routers
app.use("/auth", auth_router_1.authRouter);
app.use("/products", products_router_1.productsRouter);
app.use("/categories", categories_router_1.categoriesRouter);
// Wrong routers handler
app.all("*", errorHandling_1.handleFallbackRoute);
// Global error handler
app.use(errorHandling_1.handleGlobalError);
// Launch the server
const port = process.env.PORT ?? 8080;
server.listen(port, () => {
    console.log("The Server is Listening on port: " + port);
});
