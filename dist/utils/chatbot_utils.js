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
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ChatBotUtils {
    //To generate the id based on current year and  month
    static generateDocumentId(totalDocs) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const count = String(totalDocs + 1).padStart(4, '0');
        return `${year}${month}${count}`;
    }
    static generateOtp() {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        return randomNumber;
    }
    static sendOtpMail(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("The otp is :=>", otp);
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL,
                    pass: process.env.PASSWORD
                }
            });
            console.log("The Mail is :=>", process.env.GMAIL);
            console.log("The Password is :=>", process.env.PASSWORD);
            const mailOptions = {
                from: process.env.GMAIL, // sender address
                to: "ankitmish83@gmail.com", // recipient address
                subject: 'Your OTP Code for Verification', // Subject line
                text: `Hello, 
          
          Here is your One-Time Password (OTP) for authentication: 
          
          ${otp} 
          
          Please use this code to complete your action. This code will expire in 1 minute.
          
          If you did not request this, please ignore this email.`,
                html: `
              <p>Hello,</p>
              <p>Here is your One-Time Password (OTP) for authentication:</p>
              <h2 style="color: #4CAF50;">${otp}</h2>
              <p>Please use this code to complete your action. This code will expire in 1 minute.</p>
              <p>If you did not request this, please ignore this email.</p>
            `,
            };
            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                        reject(false);
                    }
                    else {
                        console.log('Email sent: ', info.response);
                        resolve(true);
                    }
                });
            });
        });
    }
}
//Generate Token
ChatBotUtils.generateToken = () => {
    const SECRET_KEY = process.env.JWT_SECRET || ""; // Use env for security
    const EXPIRES_IN = "1d"; // Token expiration time
    const payload = {
        isAdmin: true, // or false
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};
exports.default = ChatBotUtils;
