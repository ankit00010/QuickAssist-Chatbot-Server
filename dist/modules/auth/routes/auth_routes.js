"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth_controller"));
const auth_routes = (0, express_1.Router)();
auth_routes.post("/login", auth_controller_1.default.login);
auth_routes.post("/verify-otp", auth_controller_1.default.verifyOtp);
auth_routes.post("/generate-credentials", auth_controller_1.default.generateCredentials);
exports.default = auth_routes;
