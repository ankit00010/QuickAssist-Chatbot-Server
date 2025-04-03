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
const database_1 = require("../../../config/database");
const error_1 = __importDefault(require("../../../middleware/error"));
const chatbot_utils_1 = __importDefault(require("../../../utils/chatbot_utils"));
class WhatsappChatbotRepository {
    static verifyUser(phoneNumber, userName, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Connect to the "master" database
            const db = database_1.client.db("master");
            // Search for an existing user by phone number in the "user_data" collection
            const findUser = yield db.collection("user_data").findOne({ phone_number: phoneNumber });
            console.log(findUser);
            // If the user is found, return true
            if (findUser === null) {
                // If the user is not found, insert a new user into the "user_data" collection
                const newUser = yield db.collection("user_data").insertOne({
                    user_id,
                    phone_number: phoneNumber,
                    name: userName,
                });
                // Check if the insertion was successful
                if (!newUser.acknowledged) {
                    // If the insertion failed, throw an error
                    throw new error_1.default(500, "Database error", "Something went wrong while adding the user");
                }
                // Return the inserted user data
                return newUser;
            }
            else {
                return true;
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fetch Query Answer
    static fetchFAQResponse(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            if (!message) {
                throw new error_1.default(404, "Not Found", "Message received is empty");
            }
            const cleanedMessage = message.replace(/[^\w\s]/gi, '').toLowerCase();
            const words = cleanedMessage.split(/\s+/);
            let findData = yield db.collection("faq_info").findOne({
                $text: { $search: cleanedMessage }
            });
            if (!findData) {
                findData = yield db.collection("faq_info").findOne({
                    $or: [
                        { question: { $regex: cleanedMessage, $options: "i" } },
                        { keywords: { $in: words } }
                    ]
                });
            }
            const total = yield db.collection('faq_questions').countDocuments();
            const question_id = chatbot_utils_1.default.generateDocumentId(total);
            if (!findData) {
                yield db.collection("faq_questions").insertOne({ question_id, question: cleanedMessage });
                return false;
            }
            console.log("Data found:", findData);
            return findData;
        });
    }
}
exports.default = WhatsappChatbotRepository;
