import { Request, Response } from "express";
import ThrowError from "../../../middleware/error";
import AIChatBotRepository from "../repository/chatbot_repository";
import { client } from "../../../config/database";
import FaqInfo from "../models/faq_model";

class AIChatBotController {


    static async verifyWebHooks(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            console.log("WebHooks is verification process started...");
            res.status(200).json("Webhooks controller conection made")
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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





    static async addData(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            console.log("Adding Data...");
            const { question, answer, keywords, context } = req.body;

            const db = client.db("master");
            new FaqInfo({ question, answer, keywords, context });

            const result = await db.collection("faq_info").insertOne({
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


export default AIChatBotController;