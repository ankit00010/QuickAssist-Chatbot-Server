import { Router } from "express";
import WhatsappChatbot from "../controller/chatbot_controllers";


const chatbat_routes= Router();


chatbat_routes.get("/whatsapp-webhook",WhatsappChatbot.verifyWebHooks);
chatbat_routes.post("/whatsapp-webhook",WhatsappChatbot.receiveWhatsappQuery);
chatbat_routes.post("/add-data",WhatsappChatbot.addData);
chatbat_routes.put("/edit-data/:id",WhatsappChatbot.editData);
chatbat_routes.delete("/delete-data/:id",WhatsappChatbot.deleteData);




export default chatbat_routes;