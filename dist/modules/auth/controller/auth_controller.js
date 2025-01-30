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
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_repository_1 = __importDefault(require("../repository/auth_repository"));
const chatbot_utils_1 = __importDefault(require("../../../utils/chatbot_utils"));
class AuthController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log("Email", email);
                console.log("Password", password);
                const verify = yield auth_repository_1.default.verifyUser(email, password);
                if (!verify) {
                    return res.status(401).json({ code: 500, title: "FAILURE", message: "Email or Password is wrong" });
                }
                const otp = yield auth_repository_1.default.generateOtp();
                const generateMail = yield chatbot_utils_1.default.sendOtpMail(otp);
                console.log("The REsponse from the generated EMail is:=>", generateMail);
                if (!generateMail) {
                    return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to send the mail" });
                }
                return res.status(200).json({ code: 200, title: "SUCCESS", message: "OTP generated for 1 min" });
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
    static generateCredentials(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                console.log("Password", password);
                const saltRounds = 10;
                const hashPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const storeData = yield auth_repository_1.default.storeCredentials(email, hashPassword);
                if (!storeData) {
                    return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to store the data!!!" });
                }
                return res.status(200).json({ code: 200, title: "SUCCESS", message: "Successfully Done!!!" });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    return res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    return res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    return res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////
    static verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                if (otp === undefined || typeof otp !== "number") {
                    throw new error_1.default(400, "Validation Error", "OTP field is required and must be a number.");
                }
                const result = yield auth_repository_1.default.authOtpVerification(otp);
                if (!result) {
                    return res.status(401).json({ code: 401, title: "NOT AUTHORIZED", message: "Invalid Otp Entered" });
                }
                return res.status(200).json({ code: 200, title: "SUCCESS", message: "OTP verified successfully!!!" });
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
exports.default = AuthController;
