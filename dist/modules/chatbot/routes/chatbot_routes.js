"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatbot_controllers_1 = __importDefault(require("../controller/chatbot_controllers"));
const chatbat_routes = (0, express_1.Router)();
chatbat_routes.post("/add-data", chatbot_controllers_1.default.addData);
chatbat_routes.get("/whatsapp-webhook", chatbot_controllers_1.default.verifyWebHooks);
chatbat_routes.post("/whatsapp-webhook", chatbot_controllers_1.default.receiveWhatsappQuery);
exports.default = chatbat_routes;
