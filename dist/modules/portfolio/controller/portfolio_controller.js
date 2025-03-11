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
const error_1 = __importDefault(require("../../../middleware/error"));
class PortfolioController {
    static sendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, message, date } = req.body;
                console.log(req.body);
                // Validation: Check for empty fields
                if (!name || !email || !message || !date) {
                    throw new error_1.default(400, "VALIDATION ERROR", "EMPTY FIELDS");
                }
                // Nodemailer setup
                const transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.GMAIL, // Your Gmail
                        pass: process.env.PASSWORD // App password
                    }
                });
                // Mail content
                const mailOptions = {
                    from: process.env.GMAIL,
                    to: process.env.GMAIL,
                    subject: `New Contact Form Submission - ${name}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0;">
                        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2d5f9a;">
                            <h1 style="color: #2d5f9a; font-size: 22px; margin: 0;">Portfolio Contact Inquiry</h1>
                        </div>
                        
                        <div style="padding: 25px 0; border-bottom: 1px solid #f0f0f0;">
                            <table cellpadding="5" cellspacing="0" style="width: 100%;">
                                <tr>
                                    <td style="width: 100px; color: #5d5d5d; font-weight: bold; vertical-align: top;">Name:</td>
                                    <td style="color: #333333;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="width: 100px; color: #5d5d5d; font-weight: bold; vertical-align: top;">Email:</td>
                                    <td style="color: #333333;"><a href="mailto:${email}" style="color: #2d5f9a; text-decoration: none;">${email}</a></td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="padding: 25px 0;">
                            <h2 style="color: #2d5f9a; font-size: 16px; margin-top: 0; margin-bottom: 15px;">Message:</h2>
                            <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid #2d5f9a; color: #333333; line-height: 1.5;">
                                ${message}
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f0f0f0; color: #777777; font-size: 12px;">
                            <p>This is an automated message from your portfolio contact form.</p>
                            <p style="margin-top: 5px;">Received: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                `
                };
                const recruiterReplyOptions = {
                    from: process.env.GMAIL,
                    to: email, // The recruiter's email from the contact form
                    subject: `Thank you for your message - ${name}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0;">
                        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #2d5f9a;">
                            <h1 style="color: #2d5f9a; font-size: 22px; margin: 0;">Thank You For Reaching Out</h1>
                        </div>
                        
                        <div style="padding: 25px 0; color: #333333; line-height: 1.6;">
                            <p>Dear ${name},</p>
                            
                            <p>Thank you for contacting me through my portfolio. I appreciate your interest and the opportunity you've shared.</p>
                            
                            <p>I have received your message and will review it carefully. You can expect to hear back from me within the next 24-48 hours through this email address.</p>
                            
                            <p>If you need to reach me urgently or have any additional information to share, please feel free to reply to this email.</p>
                            
                            <div style="padding: 20px 0;">
                                <p>Best regards,</p>
                                <p style="margin: 0;"><strong>Ankit Mishra</strong></p>
                                <p style="margin: 0; color: #555555;">${process.env.GMAIL}</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f0f0f0; color: #777777; font-size: 12px;">
                            <p>This is an automated response to your message sent through my portfolio.</p>
                            <p style="margin-top: 5px;">Sent: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                `
                };
                // Send email
                const result = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Send first email (e.g., to user)
                        yield transporter.sendMail(mailOptions);
                        console.log('First email sent successfully.');
                        // Send second email (e.g., recruiter reply/notification)
                        yield transporter.sendMail(recruiterReplyOptions);
                        console.log('Second email sent successfully.');
                        // If both emails sent successfully
                        resolve(true);
                    }
                    catch (error) {
                        console.log('Error sending email:', error);
                        reject(false); // Reject if any email fails
                    }
                }));
                console.log("Boolean values are=>", result);
                if (!result) {
                    return res.status(500).json({
                        code: 500,
                        title: "FAILURE",
                        message: "Please check if your email address is entered correctly or try again later."
                    });
                }
                else {
                    // Respond back
                    return res.status(200).json({
                        code: 200,
                        title: "Success",
                        message: "Your message has been sent successfully!"
                    });
                }
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
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
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
exports.default = PortfolioController;
