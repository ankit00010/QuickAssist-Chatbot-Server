import axios from "axios";
import ThrowError from "../middleware/error";

class WhatsappService {





    static async sendCustomMessage(
        message: string, phone_number: string, user_id: string
    ): Promise<any> {
        try {
            const response: any = await axios.post(
                `https://graph.facebook.com/${process.env.VERSION}/${user_id}/messages`,
                {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: phone_number,
                    type: "text",
                    text: {
                        // Handle null responses with a default message
                        body: message,
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Response Data", response.status);

            return response.status;
        }

        catch (error) {
            throw new ThrowError(500, "FAILURE", "Failed to send the message");
        }



    }
}



export default WhatsappService;