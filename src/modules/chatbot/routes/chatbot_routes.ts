import { Router } from "express";
import AIChatBotController from "../controller/chatbot_controllers";


const chatbat_routes= Router();


chatbat_routes.post("/add-data",AIChatBotController.addData);
chatbat_routes.get("/whatsapp-webhook",AIChatBotController.verifyWebHooks);




chatbat_routes.post("/whatsapp-webhook",AIChatBotController.receiveWhatsappQuery)   ;




export default chatbat_routes;