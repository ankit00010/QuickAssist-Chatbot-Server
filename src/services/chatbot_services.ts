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
    static async sendMessageToAll(
        message: string,
        userDataList: Array<{ phone_number: string, user_id: string }>
    ): Promise<boolean> {
        try {
            const sendPromises = userDataList.map((userData, index) => {
                return new Promise<void>(async (resolve, reject) => {
                    try {
                        // Stagger the messages to avoid rate limits
                        setTimeout(async () => {
                            try {
                                const response = await axios.post(
                                    `https://graph.facebook.com/${process.env.VERSION}/${userData.user_id}/messages`,
                                    {
                                        messaging_product: "whatsapp",
                                        recipient_type: "individual",
                                        to: userData.phone_number,
                                        type: "text",
                                        text: {
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
                                console.log(`MESSAGE SENT TO USER => ${userData.phone_number} and ${userData.user_id}`);
                                resolve();
                            } catch (error) {
                                console.error(`Failed to send message to ${userData.phone_number}:`, error);
                                reject(error);
                            }
                        }, index * 500); // 500ms between each message
                    } catch (timeoutError) {
                        reject(timeoutError);
                    }
                });
            });

            await Promise.all(sendPromises);
            return true;
        } catch (error) {
            console.error("Error sending messages:", error);
            throw new ThrowError(500, "FAILURE", "Failed to send the messages");
        }
    }



}



export default WhatsappService;