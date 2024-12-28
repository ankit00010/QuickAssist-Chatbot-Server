"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const chatbot_routes_1 = __importDefault(require("./modules/chatbot/routes/chatbot_routes"));
const database_1 = require("./config/database");
dotenv_1.default.config();
(0, database_1.initalizeMongo)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 8001;
app.use("/api", chatbot_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on ${port}......`);
});
