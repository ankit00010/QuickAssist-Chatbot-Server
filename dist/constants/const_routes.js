"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.const_routes = void 0;
const express_1 = require("express");
exports.const_routes = (0, express_1.Router)();
exports.const_routes.get("/", (req, res) => {
    res.json({ message: "Server is up and running." });
});
exports.const_routes.get("/health", (req, res) => {
    res.json({ message: "Server is healthy, up and running." });
});
