import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
class ChatBotUtils {


    //To generate the id based on current year and  month
    static generateDocumentId(totalDocs: number): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const count = String(totalDocs + 1).padStart(4, '0');

        return `${year}${month}${count}`;
    }





    static generateOtp(): number {


        const randomNumber: number = Math.floor(Math.random() * 900000) + 100000;

        return randomNumber
    }



    static async sendOtpMail(
        otp: string
    ): Promise<any> {

        console.log("The otp is :=>", otp);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD
            }
        })


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
        return new Promise<boolean>((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                    reject(false)
                } else {
                    console.log('Email sent: ', info.response);
                    resolve(true);

                }
            })
        })
    }


    //Generate Token

    static generateToken = () => {

        const SECRET_KEY = process.env.JWT_SECRET || ""; // Use env for security
        const EXPIRES_IN = "1d"; // Token expiration time
        const payload = {
            isAdmin: true, // or false
        };
        return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

    }



}





export default ChatBotUtils;