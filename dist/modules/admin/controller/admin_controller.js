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
const faq_model_1 = __importDefault(require("../../chatbot/models/faq_model"));
const error_1 = __importDefault(require("../../../middleware/error"));
const fields_validation_1 = __importDefault(require("../../chatbot/validators/fields_validation"));
const chatbot_utils_1 = __importDefault(require("../../../utils/chatbot_utils"));
const admin_repository_1 = __importDefault(require("../repository/admin_repository"));
class AdminClassController {
    static addData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Adding Data...");
                const { question, answer, keywords, context } = req.body;
                console.log(req.body);
                const db = database_1.client.db("master");
                new faq_model_1.default({ question, answer, keywords, context });
                const totalDocs = yield db.collection("faq_info").countDocuments();
                const id = chatbot_utils_1.default.generateDocumentId(totalDocs);
                const result = yield db.collection("faq_info").insertOne({
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
                    return res.status(400).json({ status: 400, title: "Validation Error", message: validateFields });
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
}
exports.default = AdminClassController;
