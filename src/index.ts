import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatbat_routes from "./modules/chatbot/routes/chatbot_routes";
import { initalizeMongo } from "./config/database";
import { const_routes } from "./constants/const_routes";

dotenv.config();
initalizeMongo();
const app =express();
app.use(cors());
app.use(express.json());

const port =process.env.PORT || 8001;

app.use(const_routes);
app.use("/api",chatbat_routes);



app.listen(port,()=>{
    console.log(`Server is running on ${port}......`);
    
})


