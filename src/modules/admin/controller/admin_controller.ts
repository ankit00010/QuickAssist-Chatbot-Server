import { Request, Response } from "express";
import { client } from "../../../config/database";
import FaqInfo from "../../chatbot/models/faq_model";
import ThrowError from "../../../middleware/error";
import Validatiors from "../../chatbot/validators/fields_validation";
import ChatBotUtils from "../../../utils/chatbot_utils";
import AdminRepository from "../repository/admin_repository";
import WhatsappService from "../../../services/chatbot_services";

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static async getFaqs(
        req: Request,
        res: Response
    ): Promise<any> {
        try {

            const { page, limit, category } = req.query;

            const page_no = page ? parseInt(page as string, 10) : undefined
            const page_limit = limit ? parseInt(limit as string, 10) : undefined
            const req_category = category ? category : ""
            if (page_no === undefined || page_limit === undefined) {
                throw new ThrowError(404, "FAILURE", "Invalid page or limit parameter or undefined category");
            }

            const getData: { totalPages: number, page: number, getFaqsData: any, totalItems: number } = await AdminRepository.getFaqsData(page_no, page_limit, req_category as string);



            console.log("Value got", getData);

            return res.status(200).json({ code: 200, title: "SUCCESS", data: getData.getFaqsData, totalPages: getData.totalPages, page: page, totalItems: getData.totalItems })


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



    // Separated error handling for cleaner code
    static handleError(error: unknown, res: Response): Response {
        if (error instanceof ThrowError) {
            return res.status(error.code).json({
                code: error.code,
                title: error.title,
                message: error.message,
            });
        } else if (error instanceof Error) {
            return res.status(500).json({
                code: 500,
                title: "Internal Server Error",
                message: error.message,
            });
        } else {
            return res.status(500).json({
                code: 500,
                title: "Internal Server Error",
                message: "An unknown error occurred",
            });
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // static async adminMessage(
    //     req: Request,
    //     res: Response
    // ): Promise<any> {
    //     try {

    //         const { message } = req.body;



    //         if (!message) {
    //             throw new ThrowError(400, "VALIDATION ERROR", "EMPTY MESSAGE FIELD");
    //         }


    //         let BATCH_SIZE = 10;

    //         const getCountData = await AdminRepository.getUsersCount(message);

    //         //After Calculation of the counts we will start the process


    //         if (getCountData < BATCH_SIZE) {
    //             const BATCH_NO = 0;
    //             const getUserDetails = await AdminRepository.getUserDetails(BATCH_SIZE, BATCH_NO);

    //             const sendDataToManyUsers = await WhatsappService.sendMessageToAll(message, getUserDetails, BATCH_SIZE);

    //             if (sendDataToManyUsers) {
    //                 return res.status(200).json({ code: 200, title: "SUCCESS", message: "SUCCESSFULLY SENT THE MESSAGE" });
    //             }
    //             return res.status(500).json({ code: 500, title: "FAILURE", message: "FAILED TO SENT THE MESSAGE" });

    //         } else {

    //             let BATCH_NO = Math.ceil(getCountData.length / BATCH_SIZE);
    //             for (let i = 0; i < BATCH_NO; i++) {

    //                 const getUserDetails = await AdminRepository.getUserDetails(BATCH_SIZE, BATCH_NO);
    //                 const sendDataToManyUsers = await WhatsappService.sendMessageToAll(message, getUserDetails, BATCH_SIZE);
    //                 if (sendDataToManyUsers) {
    //                     return res.status(200).json({ code: 200, title: "SUCCESS", message: "SUCCESSFULLY SENT THE MESSAGE" });
    //                 }
    //                 return res.status(500).json({ code: 500, title: "FAILURE", message: "FAILED TO SENT THE MESSAGE" });

    //             }

    //         }


    //     } catch (error) {
    //         if (error instanceof ThrowError) {
    //             res.status(error.code).json({
    //                 code: error.code,
    //                 title: error.title,
    //                 message: error.message,
    //             });
    //         } else if (error instanceof Error) {
    //             // Handle unexpected errors
    //             res.status(500).json({
    //                 code: 500,
    //                 title: "Internal Server Error",
    //                 message: error.message,
    //             });
    //         } else {
    //             // Handle unknown errors
    //             res.status(500).json({
    //                 code: 500,
    //                 title: "Internal Server Error",
    //                 message: "An unknown error occurred",
    //             });
    //         }
    //     }
    // }

    static async adminMessage(req: Request, res: Response): Promise<any> {
        try {
            const { message } = req.body;

            if (!message) {
                throw new ThrowError(400, "VALIDATION ERROR", "EMPTY MESSAGE FIELD");
            }

            const BATCH_SIZE = 10;
            const totalUsers = await AdminRepository.getUsersCount(message);

            if (totalUsers <= 0) {
                return res.status(200).json({
                    code: 200,
                    title: "SUCCESS",
                    message: "NO USERS TO SEND MESSAGES TO"
                });
            }

            // Calculate total batches needed
            const totalBatches = Math.ceil(totalUsers / BATCH_SIZE);
            let successCount = 0;
            let failureCount = 0;

            // Process batches in sequence to avoid overwhelming the database
            for (let batchNo = 0; batchNo < totalBatches; batchNo++) {
                const userDetails = await AdminRepository.getUserDetails(BATCH_SIZE, batchNo);

                // Skip processing if no users returned in this batch
                if (!userDetails || userDetails.length === 0) continue;

                try {
                    await WhatsappService.sendMessageToAll(message, userDetails);
                    successCount += userDetails.length;
                } catch (error) {
                    failureCount += userDetails.length;
                    console.error(`Failed to send messages for batch ${batchNo}:`, error);
                    // Continue with next batch instead of failing entirely
                }
            }

            // Provide detailed response about the operation
            return res.status(200).json({
                code: 200,
                title: "OPERATION COMPLETE",
                message: `SENT ${successCount} MESSAGES SUCCESSFULLY, ${failureCount} FAILED`,
                details: {
                    totalUsers,
                    successCount,
                    failureCount
                }
            });

        } catch (error) {
            return this.handleError(error, res);
        }
    }

}
export default AdminClassController;





















