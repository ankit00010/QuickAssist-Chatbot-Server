import { Request, Response } from "express";
import { client } from "../../../config/database";
import FaqInfo from "../../chatbot/models/faq_model";
import ThrowError from "../../../middleware/error";
import Validatiors from "../../chatbot/validators/fields_validation";
import ChatBotUtils from "../../../utils/chatbot_utils";
import AdminRepository from "../repository/admin_repository";

class AdminClassController {




    static async addData(
        req: Request,
        res: Response
    ): Promise<any> {
        try {

           
            console.log("Adding Data...");
            const { question, answer, keywords, context } = req.body;
            console.log(req.body);

            const db = client.db("master");
            new FaqInfo({ question, answer, keywords, context });

            const totalDocs = await db.collection("faq_info").countDocuments();
            const id = ChatBotUtils.generateDocumentId(totalDocs);
            const result = await db.collection("faq_info").insertOne({
                faq_id: id,
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

            return res.status(200).json({ code: 200, title: "SUCCESS", message: "Data Added Successfully!!!" });
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



    static async editData(
        req: Request,
        res: Response
    ): Promise<any> {
        try {


            const { fields } = req.body;
            const id = req.params.id;
            console.log("Fields Data", fields);
            console.log("Id :", id);

            if (!id) {
                throw new ThrowError(404, "Not Found", "No id provided");
            }
            const validateFields = Validatiors.validateFields(fields);

            if (validateFields) {
                return res.status(400).json({ status: 400, title: "Validation Error", message: validateFields })
            }

            console.log("After Validation status", validateFields);

            const findData = await AdminRepository.findDataById(id);

            if (findData === false) {
                throw new ThrowError(404, "Not Found", "No Data by availabe");
            }

            const updateData = await AdminRepository.updateData(id, fields)

            if (updateData === false) {
                throw new ThrowError(500, "FAILURE", "Failed to update the data");
            }

            return res.status(201).json({ status: 200, title: "SUCCESS", message: "Successfully Updated the given Data" })
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


    //Delete faq Data 

    static async deleteData(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            const id = req.params.id;


            //verify Data in a database
            const verify = await AdminRepository.findDataById(id);


            if (!verify) {
                throw new ThrowError(404, "Not Found", "No Data found in a Database");

            }

            const deleteData = await AdminRepository.deleteFaqData(id);;


            if (!deleteData) {
                return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to Delete the Data from the Database" });

            }

            return res.status(200).json({ code: 200, title: "SUCCESSS", message: "Data Deleted Successfully" });

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
export default AdminClassController;




















    
