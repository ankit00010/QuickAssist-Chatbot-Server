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
            // Connect to the "master" database
            const db = yield database_1.client.db("master");
            // Throw an error if the message is empty
            if (!message) {
                throw new error_1.default(404, "Not Found", "Message received is empty");
            }
            // Clean the message: remove punctuation and convert to lowercase
            const cleanedMessage = message.replace(/[^\w\s]/gi, '').toLowerCase();
            // Tokenize the cleaned message into individual words
            const messageWords = cleanedMessage.split(/\s+/);
            // Perform the query using the $or operator to match either keywords or context
            const findData = yield db.collection("faq_info").findOne({
                $or: [
                    { question: messageWords },
                    { keywords: { $in: messageWords } }
                ]
            });
            // If no data is found, return a default response
            if (!findData) {
                return false;
            }
            // Return the found data
            return findData;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Find Data in a Database by Id
    static findDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const find_data = yield db.collection("faq_info").findOne({
                faq_id: id,
            });
            if (!find_data) {
                return false;
            }
            return true;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update Data function
    static updateData(id, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const updateData = yield db.collection("faq_info").findOneAndUpdate({ faq_id: id }, // Find the document by faq_id
            { $set: field }, // Use $set to update the provided fields in "field"
            { returnDocument: 'after' });
            return updateData.value !== null;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static deleteFaqData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const deleteData = yield db.collection("faq_info").findOneAndDelete({
                faq_id: id
            });
            if (deleteData) {
                return true;
            }
            return false;
        });
    }
}
exports.default = WhatsappChatbotRepository;
