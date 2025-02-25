import { ObjectId } from "mongodb";
import { client } from "../../../config/database";
import ThrowError from "../../../middleware/error";
import { editFields } from "../models/faq_model";

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
        // Connect to the "master" database
        const db = await client.db("master");

        // Throw an error if the message is empty
        if (!message) {
            throw new ThrowError(404, "Not Found", "Message received is empty");
        }

        // Clean the message: remove punctuation and convert to lowercase
        const cleanedMessage = message.replace(/[^\w\s]/gi, '').toLowerCase();

        // Tokenize the cleaned message into individual words
        const messageWords = cleanedMessage.split(/\s+/);

        // Perform the query using the $or operator to match either keywords or context
        const findData = await db.collection<any>("faq_info").findOne({
            $or: [
                { question: messageWords },
                { keywords: { $in: messageWords } }
            ]
        });

        // If no data is found, return a default response
        if (!findData) {
            await db.collection("faq_questions").insertOne({question:message});
            return false;
        }

        // Return the found data
        return findData;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    


}

export default WhatsappChatbotRepository;