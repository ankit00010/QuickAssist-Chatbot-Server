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
const const_routes_1 = require("./constants/const_routes");
const admin_routes_1 = __importDefault(require("./modules/admin/routes/admin_routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/routes/auth_routes"));
const portfolio_routes_1 = __importDefault(require("./modules/portfolio/routes/portfolio_routes"));
dotenv_1.default.config();
(0, database_1.initalizeMongo)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 8001;
app.use(const_routes_1.const_routes);
app.use("/api", chatbot_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/portfolio", portfolio_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on ${port}......`);
});
