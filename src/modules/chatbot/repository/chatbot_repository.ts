import { ObjectId } from "mongodb";
import { client } from "../../../config/database";
import ThrowError from "../../../middleware/error";
import { editFields } from "../../admin/models/faq_model";
import ChatBotUtils from "../../../utils/chatbot_utils";

class WhatsappChatbotRepository {




    static async verifyUser(
        phoneNumber: string,
        userName: string,
        user_id: string,
    ): Promise<any> {
        // Connect to the "master" database
        const db = client.db("master");

        // Search for an existing user by phone number in the "user_data" collection
        const findUser = await db.collection<any>("user_data").findOne({ phone_number: phoneNumber });
        console.log(findUser);

        // If the user is found, return true
        if (findUser === null) {
            // If the user is not found, insert a new user into the "user_data" collection
            const newUser = await db.collection<any>("user_data").insertOne({
                user_id,
                phone_number: phoneNumber,
                name: userName,
            });

            // Check if the insertion was successful
            if (!newUser.acknowledged) {
                // If the insertion failed, throw an error
                throw new ThrowError(500, "Database error", "Something went wrong while adding the user");
            }

            // Return the inserted user data
            return newUser;
        } else {
            return true
        }






    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // fetch Query Answer
    static async fetchFAQResponse(message: string): Promise<any> {
        const db = await client.db("master");
    
        if (!message) {
            throw new ThrowError(404, "Not Found", "Message received is empty");
        }
    
        
        const cleanedMessage = message.replace(/[^\w\s]/gi, '').toLowerCase();
        const words = cleanedMessage.split(/\s+/); 
    
        
        let findData = await db.collection("faq_info").findOne({
            $text: { $search: cleanedMessage } 
        });
    
        if (!findData) {
            findData = await db.collection("faq_info").findOne({
                $or: [
                    { question: { $regex: cleanedMessage, $options: "i" } }, 
                    { keywords: { $in: words } }
                ]
            });
        }
    
        const total: number = await db.collection('faq_questions').countDocuments();
        const question_id = ChatBotUtils.generateDocumentId(total);
    
        if (!findData) {
            await db.collection("faq_questions").insertOne({ question_id, question: cleanedMessage });
            return false;
        }
    
        console.log("Data found:", findData);
        return findData;
    }
    


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





}

export default WhatsappChatbotRepository;