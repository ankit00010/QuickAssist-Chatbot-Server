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
const error_1 = __importDefault(require("../../../middleware/error"));
class AdminRepository {
    //Find Data in a Database by Id
    static findDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const find_data = yield db.collection("faq_info").findOne({
                faq_id: id,
            });
            if (!find_data) {
                return false;
            }
            return true;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update Data function
    static updateData(id, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const updateData = yield db.collection("faq_info").findOneAndUpdate({ faq_id: id }, // Find the document by faq_id
            { $set: field }, // Use $set to update the provided fields in "field"
            { returnDocument: 'after' });
            return updateData.value !== null;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static deleteFaqData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const deleteData = yield db.collection("faq_info").findOneAndDelete({
                faq_id: id
            });
            if (deleteData) {
                return true;
            }
            return false;
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getFaqsData(page, limit, category) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            let filter = {};
            if (category && category.trim() !== "") {
                filter.context = category;
            }
            console.log("Filter is ", filter);
            const totalUnAnsweredQuestions = yield db.collection("faq_questions").countDocuments();
            const getFaqsData = yield db.collection("faq_info").find(filter).skip((page - 1) * limit).limit(limit).project({ faq_id: 1, question: 1, answer: 1, context: 1, keywords: 1 }).toArray();
            const totalItems = yield db.collection("faq_info").countDocuments(filter);
            console.log("The data founded is", getFaqsData.length);
            console.log("VALUE=> ", totalUnAnsweredQuestions);
            const totalPages = Math.ceil(totalItems / limit);
            const data = {
                page,
                totalPages,
                getFaqsData,
                totalItems,
                totalUnAnsweredQuestions
            };
            return data;
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getUsersCount(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const count = yield db.collection("user_data").countDocuments();
            console.log("The result is ", count);
            // const getData = await db.collection<UserProps>("user_data").find({}).toArray();
            // console.log("USER DATA => ", getData);
            // if (getData === null) {
            //     throw new ThrowError(500, "NO USER", "NO USER IN A DATABASE");
            // }
            return count;
            // const data
            // return getData;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getUserDetails(BATCH_SIZE, BATCH_NO) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const user_data = yield db.collection("user_data")
                .find({})
                .skip(BATCH_NO * BATCH_SIZE)
                .limit(BATCH_SIZE)
                .project({ _id: 0, phone_number: 1, user_id: 1 })
                .toArray();
            return user_data;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static getUnAnsweredData(limit, user_Id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const questions_list = yield db.collection("faq_questions")
                .find({ answers: { $exists: false }, lockedBy: { $in: [user_Id, null] } })
                .sort({ created_at: 1 })
                .limit(limit).toArray();
            let count = 0;
            const assignedDataCount = yield db.collection("faq_questions").find({ lockedBy: user_Id }).toArray();
            if (questions_list.length === 0) {
                throw new error_1.default(500, "NO DATA FOUND", "No data is there");
            }
            if (assignedDataCount.length !== 0) {
                count = assignedDataCount.length;
            }
            else {
                count = questions_list.length;
            }
            const questionIds = questions_list.map(q => q._id);
            const lockingQuestions = yield db.collection("faq_questions").updateMany({ _id: { $in: questionIds } }, { $set: { lockedBy: user_Id, lockedAt: new Date() } });
            if (!lockingQuestions.acknowledged) {
                throw new error_1.default(500, "Failed To Lock", `Something went wrong while locking questions for user ${user_Id}.`);
            }
            return { questions_list, count };
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static deleteUnAnsweredQuestions(user_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const count = yield db.collection("faq_questions").find({ lockedBy: user_ID }).toArray();
            if (count.length === 0) {
                throw new error_1.default(500, "FAILURE", "No data available for deletion as no questions are assigned to you.");
            }
            const deleteData = yield db.collection("faq_questions").deleteMany({ lockedBy: user_ID });
            if (!deleteData.acknowledged) {
                return false;
            }
            return true;
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static usersData(limit, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const getUsersData = yield db.collection("user_data").find({}).skip(skip).limit(limit).toArray();
            console.log(getUsersData);
            const getTotalCount = yield db.collection("user_data")
                .countDocuments({
                user_id: { $exists: true },
                phone_number: { $exists: true },
                name: { $exists: true }
            });
            let totalPages = 0;
            console.log("The total Count is => ", getTotalCount);
            if (getTotalCount > 0) {
                totalPages = Math.ceil(getTotalCount / limit);
            }
            else {
                totalPages = 1;
            }
            if (!getUsersData || getUsersData.length === 0) {
                throw new error_1.default(500, "NO DATA FOUND", "No Users Data Available");
            }
            return {
                usersData: getUsersData,
                totalPages,
                totalItems: getTotalCount
            };
        });
    }
}
exports.default = AdminRepository;
