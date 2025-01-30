import { Request, Response } from "express";
import ThrowError from "../../../middleware/error";
import bcrypt from "bcrypt"
import AuthRepository from "../repository/auth_repository";
import ChatBotUtils from "../../../utils/chatbot_utils";
class AuthController {
    static async login(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            const { email, password } = req.body;

            console.log("Email", email);
            console.log("Password", password);

            const verify = await AuthRepository.verifyUser(email, password);


            if (!verify) {
                return res.status(401).json({ code: 500, title: "FAILURE", message: "Email or Password is wrong" });
            }


            const otp = await AuthRepository.generateOtp();


            const generateMail = await ChatBotUtils.sendOtpMail(otp);
            console.log("The REsponse from the generated EMail is:=>", generateMail);

            if (!generateMail) {
                return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to send the mail" });
            }

            return res.status(200).json({ code: 200, title: "SUCCESS", message: "OTP generated for 1 min" });


        } catch (error) {
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



    static async generateCredentials(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            const { email, password } = req.body;
            console.log("Password", password);

            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);


            const storeData = await AuthRepository.storeCredentials(email, hashPassword);


            if (!storeData) {
                return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to store the data!!!" });

            }

            return res.status(200).json({ code: 200, title: "SUCCESS", message: "Successfully Done!!!" });
        } catch (error) {
            if (error instanceof ThrowError) {
                return res.status(error.code).json({
                    code: error.code,
                    title: error.title,
                    message: error.message,
                });
            } else if (error instanceof Error) {
                // Handle unexpected errors
                return res.status(500).json({
                    code: 500,
                    title: "Internal Server Error",
                    message: error.message,
                });
            } else {
                // Handle unknown errors
                return res.status(500).json({
                    code: 500,
                    title: "Internal Server Error",
                    message: "An unknown error occurred",
                });
            }
        }
    }







    ////////////////////////////////////////////////////////////////////////////////


    static async verifyOtp(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            const { otp } = req.body;

            if (otp === undefined || typeof otp !== "number") {
                throw new ThrowError(400, "Validation Error", "OTP field is required and must be a number.");
            }



            const result = await AuthRepository.authOtpVerification(otp);

            if (!result) {
                return res.status(401).json({ code: 401, title: "NOT AUTHORIZED", message: "Invalid Otp Entered" })

            }
            return res.status(200).json({ code: 200, title: "SUCCESS", message: "OTP verified successfully!!!" })


        } catch (error) {
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






}



export default AuthController;