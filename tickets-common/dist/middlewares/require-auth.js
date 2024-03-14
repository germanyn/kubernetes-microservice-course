"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const UnauthorizedError_1 = require("../errors/UnauthorizedError");
const requireAuth = (req, res, next) => {
    if (!req.currentUser)
        throw new UnauthorizedError_1.UnauthorizedError();
    next();
};
exports.requireAuth = requireAuth;
