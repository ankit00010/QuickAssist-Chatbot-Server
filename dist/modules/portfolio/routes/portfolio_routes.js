"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolio_controller_1 = __importDefault(require("../controller/portfolio_controller"));
const portfolio_router = (0, express_1.Router)();
portfolio_router.post("/send-email", portfolio_controller_1.default.sendEmail);
exports.default = portfolio_router;
