import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatbat_routes from "./modules/chatbot/routes/chatbot_routes";
import { initalizeMongo } from "./config/database";
import { const_routes } from "./constants/const_routes";
import admin_routes from "./modules/admin/routes/admin_routes";
import auth_routes from "./modules/auth/routes/auth_routes";
import portfolio_router from "./modules/portfolio/routes/portfolio_routes";

dotenv.config();
initalizeMongo();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8001;

app.use(const_routes);
app.use("/api", chatbat_routes);
app.use("/api/auth", auth_routes);
app.use("/api/admin", admin_routes);
app.use("/api/portfolio", portfolio_router);

app.listen(port, () => {
    console.log(`Server is running on ${port}......`);

})


