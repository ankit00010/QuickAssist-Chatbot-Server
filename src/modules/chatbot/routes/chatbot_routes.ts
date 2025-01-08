import { Router } from "express";
import WhatsappChatbot from "../controller/chatbot_controllers";


const chatbat_routes= Router();


chatbat_routes.post("/add-data",WhatsappChatbot.addData);
chatbat_routes.get("/whatsapp-webhook",WhatsappChatbot.verifyWebHooks);




chatbat_routes.post("/whatsapp-webhook",WhatsappChatbot.receiveWhatsappQuery)   ;




export default chatbat_routes;