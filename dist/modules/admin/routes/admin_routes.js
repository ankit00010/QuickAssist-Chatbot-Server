"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("../controller/admin_controller"));
const admin_routes = (0, express_1.Router)();
admin_routes.post("/add-data", admin_controller_1.default.addData);
admin_routes.put("/edit-data/:id", admin_controller_1.default.editData);
admin_routes.delete("/delete-data/:id", admin_controller_1.default.deleteData);
exports.default = admin_routes;
