import { Request, response, Response } from "express";
import ThrowError from "../../../middleware/error";
import AIChatBotRepository from "../repository/chatbot_repository";
import { client } from "../../../config/database";
import FaqInfo from "../../admin/models/faq_model";
import WhatsappChatbotRepository from "../repository/chatbot_repository";
import axios from "axios";
import WhatsappService from "../../../services/chatbot_services";
import Validatiors from "../validators/fields_validation";
import { ObjectId } from "mongodb";
import ChatBotUtils from "../../../utils/chatbot_utils";

class WhatsappChatbot {

    static async verifyWebHooks(
        req: Request,
        res: Response
    ): Promise<any> {
        // Retrieve the verification token from environment variables
        const VERIFY_TOKEN = process.env.WEBHOOK_TOKEN;

        // Extract query parameters sent by the webhook provider
        const mode = req.query['hub.mode']; // The mode of the webhook request (e.g., 'subscribe')
        const token = req.query['hub.verify_token']; // The verification token provided by the webhook provider
        const challenge = req.query['hub.challenge']; // The challenge code to be  echoed back for verification

        // Check if the request is a subscription request and if the token matches the expected value
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Log success message to the console
            console.log('Webhook verification successful');

            // Respond with the challenge code as required for successful webhook verification
            res.status(200).send(challenge);
        } else {
            // Log error message to the console if verification fails
            console.error('Webhook verification failed');

            // Respond with a 403 Forbidden status indicating verification failure
            res.status(403).send('Forbidden');
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    static async receiveWhatsappQuery(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            // Extract the incoming message data from the request body
            const incomingMessage = req.body;

            // Extract the user message, phone number, name, and ID from the message data
            const userMessage = incomingMessage.entry[0].changes[0].value.messages[0].text.body;
            const phoneNumber = incomingMessage.entry[0].changes[0].value.messages[0].from;
            const userName = incomingMessage.entry[0].changes[0].value.contacts[0].profile.name;
            const userID = incomingMessage.entry[0].changes[0].value.metadata.phone_number_id;
            let message;

            // Check if both user message and phone number are provided
            if (userMessage && phoneNumber) {

                // Verify if the user is already registered in the system
                const verifyUser = await WhatsappChatbotRepository.verifyUser(phoneNumber, userName, userID);

                // If the user is already registered
                if (typeof verifyUser === "boolean") {

                    // Fetch the response for frequently asked questions (FAQ) based on the user's message
                    const getQueryAns = await WhatsappChatbotRepository.fetchFAQResponse(userMessage)

                    // If no response is found for the query, send a default response
                    if (typeof getQueryAns === "boolean") {
                        message = "Sorry, we couldn't find an answer to your question.";
                        const sendMessage: any = await WhatsappService.sendCustomMessage(message, phoneNumber, userID);

                        // Check if the message was successfully sent
                        if (sendMessage === 200) {
                            return res.status(200).json("Message sent Successfully!!!");
                        } else {
                            return res.status(500).json("Failed to send the message!!!");
                        }
                    } else {
                        // If a response is found, send the answer to the user
                        console.log(getQueryAns);

                        const sendMessage: any = await WhatsappService.sendCustomMessage(getQueryAns.answer, phoneNumber, userID);
                        console.log('Message sent successfully:', sendMessage);

                        // Check if the message was successfully sent
                        if (sendMessage === 200) {
                            return res.status(200).json("Message sent Successfully!!!");
                        } else {
                            return res.status(500).json("Failed to send the message!!!");
                        }
                    }

                } else {
                    // If the user is not registered, send a welcome message
                    message = `Welcome ${userName} my name is Pacific. I am here to assist you with your query. How can I help you?`;
                    const sendMessage: any = await WhatsappService.sendCustomMessage(message, phoneNumber, userID);
                    console.log('Message sent successfully:', sendMessage);

                    // Check if the message was successfully sent
                    if (sendMessage === 200) {
                        return res.status(200).json("Message sent Successfully!!!");
                    } else {
                        return res.status(500).json("Failed to send the message!!!");
                    }
                }
            } else {
                return res.status(500).json("Failed to receive message");
            }

        } catch (error) {
            // Handle known errors from ThrowError class
            if (error instanceof ThrowError) {
                res.status(error.code).json({
                    code: error.code,
                    title: error.title,
                    message: error.message,
                });
            } else if (error instanceof Error) {
                // Handle unexpected errors
                res.status(500).json({
                    code: 500,
                    title: "Internal Server Error",
                    message: error.message,
                });
            } else {
                // Handle unknown errors
                res.status(500).json({
                    code: 500,
                    title: "Internal Server Error",
                    message: "An unknown error occurred",
                });
            }
        }
    }









    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



}


export default WhatsappChatbot;