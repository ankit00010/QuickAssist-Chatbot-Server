import { ObjectId } from "mongodb";
import { client } from "../../../config/database";
import ThrowError from "../../../middleware/error";
import bcrypt from "bcrypt";
import ChatBotUtils from "../../../utils/chatbot_utils";
interface AdminCredentials {
    _id: ObjectId;
    email: string;
    password: string;
}


class AuthRepository {







    static async verifyUser(
        email: string, password: string
    ): Promise<boolean> {

        const db = await client.db("master");

        const result = await db.collection<AdminCredentials>("admin_credentails").findOne({ email });

        if (!result) {
            throw new ThrowError(401, "Not Authorized", "Incorrect Email or Password");
        }

        console.log(result);

        const dbPassword = result.password;
        console.log("The dbPassword is :=> ", dbPassword);
        console.log("The password is :=> ", password);

        const verifyPassword = await bcrypt.compare(password, dbPassword);
        console.log("Result : =>", verifyPassword);


        return verifyPassword;


    }







    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    static async storeCredentials(
        email: string, password: string
    ): Promise<any> {
        console.log("Email", email);
        console.log("Password", password);

        const db = await client.db("master");

        const result = await db.collection<any>("admin_credentails").insertOne({
            email: email,
            password: password,
        });


        return result.acknowledged;


    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








    static async generateOtp(): Promise<any> {
        const db = client.db("master"); 
        const collection = db.collection("verification_otps");
    
        //Delete the previous otps if there is one
        await collection.deleteMany({});
    
        // Generate OTP
        const otp = ChatBotUtils.generateOtp();
    
        // Insert OTP with expiration time
        const result = await collection.insertOne({
            otp,
            createdAt: new Date(),
        });
    
        if (!result.acknowledged) {
            throw new ThrowError(500, "FAILURE", "Something went wrong while generating the OTP");
        }
    
        // Ensure index exists for automatic expiration
        await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds:60});
    
        return otp;
    }
    

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    static async authOtpVerification(
        otp: number
    ): Promise<boolean> {

        const db = await client.db("master");

        const getOtp: any = await db.collection("verification_otps").findOne({});
        console.log(getOtp?.otp);

        if (getOtp && getOtp.otp !== null && getOtp.otp === otp) {
            return true
        }

        return false


    }























}


export default AuthRepository;