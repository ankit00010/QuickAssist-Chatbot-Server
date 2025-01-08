"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../../../middleware/error"));
const database_1 = require("../../../config/database");
const faq_model_1 = __importDefault(require("../models/faq_model"));
const chatbot_repository_1 = __importDefault(require("../repository/chatbot_repository"));
const whatsapp_services_1 = __importDefault(require("../../../services/whatsapp_services"));
class WhatsappChatbot {
    static verifyWebHooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            else {
                // Log error message to the console if verification fails
                console.error('Webhook verification failed');
                // Respond with a 403 Forbidden status indicating verification failure
                res.status(403).send('Forbidden');
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static receiveWhatsappQuery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    const verifyUser = yield chatbot_repository_1.default.verifyUser(phoneNumber, userName, userID);
                    // If the user is already registered
                    if (typeof verifyUser === "boolean") {
                        // Fetch the response for frequently asked questions (FAQ) based on the user's message
                        const getQueryAns = yield chatbot_repository_1.default.fetchFAQResponse(userMessage);
                        // If no response is found for the query, send a default response
                        if (typeof getQueryAns === "boolean") {
                            message = "Sorry, we couldn't find an answer to your question.";
                            const sendMessage = yield whatsapp_services_1.default.sendCustomMessage(message, phoneNumber, userID);
                            // Check if the message was successfully sent
                            if (sendMessage === 200) {
                                return res.status(200).json("Message sent Successfully!!!");
                            }
                            else {
                                return res.status(500).json("Failed to send the message!!!");
                            }
                        }
                        else {
                            // If a response is found, send the answer to the user
                            console.log(getQueryAns);
                            const sendMessage = yield whatsapp_services_1.default.sendCustomMessage(getQueryAns.answer, phoneNumber, userID);
                            console.log('Message sent successfully:', sendMessage);
                            // Check if the message was successfully sent
                            if (sendMessage === 200) {
                                return res.status(200).json("Message sent Successfully!!!");
                            }
                            else {
                                return res.status(500).json("Failed to send the message!!!");
                            }
                        }
                    }
                    else {
                        // If the user is not registered, send a welcome message
                        message = `Welcome ${userName} my name is Pacific. I am here to assist you with your query. How can I help you?`;
                        const sendMessage = yield whatsapp_services_1.default.sendCustomMessage(message, phoneNumber, userID);
                        console.log('Message sent successfully:', sendMessage);
                        // Check if the message was successfully sent
                        if (sendMessage === 200) {
                            return res.status(200).json("Message sent Successfully!!!");
                        }
                        else {
                            return res.status(500).json("Failed to send the message!!!");
                        }
                    }
                }
                else {
                    return res.status(500).json("Failed to receive message");
                }
            }
            catch (error) {
                // Handle known errors from ThrowError class
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static addData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adding Data...");
                const { question, answer, keywords, context } = req.body;
                const db = database_1.client.db("master");
                new faq_model_1.default({ question, answer, keywords, context });
                const result = yield db.collection("faq_info").insertOne({
                    question,
                    answer,
                    keywords,
                    context,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                if (!result.acknowledged) {
                    return res.status(500).json({
                        title: "FAILURE",
                        message: "Failed to add the data in a database",
                    });
                }
                return res.status(200).json("Data added successfully to the database");
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
}
exports.default = WhatsappChatbot;
