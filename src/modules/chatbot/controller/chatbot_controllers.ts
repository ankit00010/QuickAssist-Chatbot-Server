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
        } else {
          // Log error message to the console if verification fails
          console.error('Webhook verification failed');
          
          // Respond with a 403 Forbidden status indicating verification failure
          res.status(403).send('Forbidden');
        }
      }
      

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      
    
      static async receiveWhatsappQuery(
        req: Request,
        res: Response
      ): Promise<any> {
        try {
            const incomingMessage=req.body;   //Request body

            console.log("Incoming messagee Body : ",incomingMessage);
            
        } catch (error) {
          res.status(500).json({ error });
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