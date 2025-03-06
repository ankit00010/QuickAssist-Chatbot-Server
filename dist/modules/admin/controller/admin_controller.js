"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../config/database");
const faq_model_1 = __importDefault(require("../models/faq_model"));
const error_1 = __importDefault(require("../../../middleware/error"));
const chatbot_utils_1 = __importDefault(require("../../../utils/chatbot_utils"));
const admin_repository_1 = __importDefault(require("../repository/admin_repository"));
const chatbot_services_1 = __importDefault(require("../../../services/chatbot_services"));
const fields_validation_1 = __importDefault(require("../../chatbot/validators/fields_validation"));
class AdminClassController {
    static getDashboardDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield admin_repository_1.default.dashboardDetailsRepo();
                return res.status(200).json({ code: 200, title: "SUCCESS", message: "RETRIEVED DATA SUCCESSFULLY!", result: details });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    static addData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adding Data...");
                const faqs = req.body.transformedFAQs;
                console.log("faqs  are ", faqs);
                // Validate the request data
                const validationErrors = faq_model_1.default.validateMultipleFields(faqs);
                if (validationErrors.length > 0) {
                    return res.status(400).json({ code: 400, title: "VALIDATION ERROR", message: validationErrors });
                }
                const db = database_1.client.db("master");
                const totalDocs = yield db.collection("faq_info").countDocuments();
                const date = new Date();
                // Map FAQs for batch insertion
                const faqsArray = faqs.map((faq, index) => {
                    var _a, _b, _c;
                    return ({
                        faq_id: chatbot_utils_1.default.generateDocumentId(totalDocs + index),
                        question: ((_a = faq.question) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "",
                        answer: ((_b = faq.answer) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                        keywords: Array.isArray(faq.keywords) ? faq.keywords : [],
                        context: ((_c = faq.context) === null || _c === void 0 ? void 0 : _c.trim()) || "",
                        created_at: date,
                        updated_at: date
                    });
                });
                console.log("FAQ DATA are ", faqsArray);
                // Insert multiple or single FAQ(s)
                const result = faqs.length > 1
                    ? yield db.collection("faq_info").insertMany(faqsArray)
                    : yield db.collection("faq_info").insertOne(faqsArray[0]);
                if (!result.acknowledged) {
                    return res.status(500).json({ title: "FAILURE", message: "Failed to add data to the database" });
                }
                return res.status(200).json({ code: 200, title: "SUCCESS", message: "Data Added Successfully!!!" });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static editData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fields } = req.body;
                const id = req.params.id;
                console.log("Fields Data", fields);
                console.log("Id :", id);
                if (!id) {
                    throw new error_1.default(404, "Not Found", "No id provided");
                }
                const validateFields = fields_validation_1.default.validateFields(fields);
                if (validateFields) {
                    return res.status(400).json({ status: 400, title: "Validation Error" });
                }
                console.log("After Validation status", validateFields);
                const findData = yield admin_repository_1.default.findDataById(id);
                if (findData === false) {
                    throw new error_1.default(404, "Not Found", "No Data by availabe");
                }
                const updateData = yield admin_repository_1.default.updateData(id, fields);
                if (updateData === false) {
                    throw new error_1.default(500, "FAILURE", "Failed to update the data");
                }
                return res.status(201).json({ status: 200, title: "SUCCESS", message: "Successfully Updated the given Data" });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Delete faq Data 
    static deleteData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                //verify Data in a database
                const verify = yield admin_repository_1.default.findDataById(id);
                if (!verify) {
                    throw new error_1.default(404, "Not Found", "No Data found in a Database");
                }
                const deleteData = yield admin_repository_1.default.deleteFaqData(id);
                ;
                if (!deleteData) {
                    return res.status(500).json({ code: 500, title: "FAILURE", message: "Failed to Delete the Data from the Database" });
                }
                return res.status(200).json({ code: 200, title: "SUCCESSS", message: "Data Deleted Successfully" });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getFaqs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit, category } = req.query;
                const page_no = page ? parseInt(page, 10) : undefined;
                const page_limit = limit ? parseInt(limit, 10) : undefined;
                const req_category = category ? category : "";
                if (page_no === undefined || page_limit === undefined) {
                    throw new error_1.default(404, "FAILURE", "Invalid page or limit parameter or undefined category");
                }
                const getData = yield admin_repository_1.default.getFaqsData(page_no, page_limit, req_category);
                console.log("Value got", getData);
                return res.status(200).json({ code: 200, title: "SUCCESS", data: getData.getFaqsData, totalPages: getData.totalPages, page: page, totalItems: getData.totalItems, unAnsQuestionsCount: getData.totalUnAnsweredQuestions });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    // Separated error handling for cleaner code
    static handleError(error, res) {
        if (error instanceof error_1.default) {
            return res.status(error.code).json({
                code: error.code,
                title: error.title,
                message: error.message,
            });
        }
        else if (error instanceof Error) {
            return res.status(500).json({
                code: 500,
                title: "Internal Server Error",
                message: error.message,
            });
        }
        else {
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
    static adminMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message } = req.body;
                if (!message) {
                    throw new error_1.default(400, "VALIDATION ERROR", "EMPTY MESSAGE FIELD");
                }
                const BATCH_SIZE = 10;
                const totalUsers = yield admin_repository_1.default.getUsersCount();
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
                    const userDetails = yield admin_repository_1.default.getUserDetails(BATCH_SIZE, batchNo);
                    // Skip processing if no users returned in this batch
                    if (!userDetails || userDetails.length === 0)
                        continue;
                    try {
                        yield chatbot_services_1.default.sendMessageToAll(message, userDetails);
                        successCount += userDetails.length;
                    }
                    catch (error) {
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
            }
            catch (error) {
                return this.handleError(error, res);
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static questionsUnAnswered(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limit, user_Id } = req.body;
                console.log("Limit Value", typeof limit);
                console.log("User ID", typeof user_Id);
                const transformedLimit = Math.ceil(parseInt(limit, 10));
                if (!limit && !user_Id) {
                    throw new error_1.default(400, "INVALID REQUEST", "Both 'total_questions_asked' and 'user_ID' parameters are missing.");
                }
                const getData = yield admin_repository_1.default.getUnAnsweredData(transformedLimit, user_Id);
                console.log("Data value received is ", getData);
                return res.status(200).json({ code: 200, tite: "SUCCESS", message: "Data received", data: getData });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static deleteQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log('The id got is ', id);
                if (!id) {
                    throw new error_1.default(400, "EMPTY FIELDS", "IDS provided are either empty or undefined");
                }
                const deleteData = yield admin_repository_1.default.deleteUnAnsweredQuestions(id);
                if (!deleteData) {
                    throw new error_1.default(500, "FAILURE", "Failed to delete the data");
                }
                return res.status(200).json({ code: 200, tite: "SUCCESS", message: "Deleted previous Data successfully" });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static usersList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const skip = (page - 1) * limit;
                const getUserDetails = yield admin_repository_1.default.usersData(limit, skip);
                res.status(200).json({
                    code: 200,
                    title: "SUCCESS",
                    message: "Data retreived Successfully",
                    data: getUserDetails.usersData,
                    totalPages: getUserDetails.totalPages,
                    totalItems: getUserDetails.totalItems,
                    currentPage: page
                });
            }
            catch (error) {
                if (error instanceof error_1.default) {
                    res.status(error.code).json({
                        code: error.code,
                        title: error.title,
                        message: error.message,
                    });
                }
                else if (error instanceof Error) {
                    // Handle unexpected errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: error.message,
                    });
                }
                else {
                    // Handle unknown errors
                    res.status(500).json({
                        code: 500,
                        title: "Internal Server Error",
                        message: "An unknown error occurred",
                    });
                }
            }
        });
    }
}
exports.default = AdminClassController;
