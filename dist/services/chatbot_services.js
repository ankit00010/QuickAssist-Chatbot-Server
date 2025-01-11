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
const axios_1 = __importDefault(require("axios"));
const error_1 = __importDefault(require("../middleware/error"));
class WhatsappService {
    static sendCustomMessage(message, phone_number, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`https://graph.facebook.com/${process.env.VERSION}/${user_id}/messages`, {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: phone_number,
                    type: "text",
                    text: {
                        // Handle null responses with a default message
                        body: message,
                    },
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log("Response Data", response.status);
                return response.status;
            }
            catch (error) {
                throw new error_1.default(500, "FAILURE", "Failed to send the message");
            }
        });
    }
}
exports.default = WhatsappService;
