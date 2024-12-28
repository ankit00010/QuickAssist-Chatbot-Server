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
const error_1 = __importDefault(require("../../middleware/error"));
const database_1 = require("../../config/database");
class AIChatBotController {
    static verifyWebHooks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("WebHooks is verification process started...");
                res.status(200).json("Webhooks controller conection made");
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
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static addData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adding Data...");
                const { question, answer, keywords, context } = req.body;
                const db = database_1.client.db("master");
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
exports.default = AIChatBotController;
