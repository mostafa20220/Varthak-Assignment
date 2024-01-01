"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowTo = void 0;
const AppError_1 = require("../utils/AppError");
const roles_1 = require("../config/roles");
const verifyTokens_1 = require("./verifyTokens");
const allowTo = (...roles) => {
    return (req, res, next) => {
        (0, verifyTokens_1.verifyTokens)(req, res, next);
        const user = req?.payload;
        // console.log("from verify, user: ", user);
        if (!user)
            return next(new AppError_1.AppError(401, "fail", "req.payload is undefined"));
        // user has many roles, so we need to check if the user has at least one of the required roles
        let hasAccess = false;
        if (roles.includes(roles_1.ALL))
            hasAccess = true;
        else
            roles.forEach((role) => {
                if (user.roles.includes(role))
                    hasAccess = true;
            });
        if (!hasAccess)
            return next(new AppError_1.AppError(403, "fail", "You are not authorized to do this action"));
        next();
    };
};
exports.allowTo = allowTo;
