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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../config/database");
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
            const getFaqsData = yield db.collection("faq_info").find(filter).skip((page - 1) * limit).limit(limit).project({ faq_id: 1, question: 1, answer: 1 }).toArray();
            const totalItems = yield db.collection("faq_info").countDocuments(filter);
            console.log("The data founded is", getFaqsData.length);
            const totalPages = Math.ceil(totalItems / limit);
            const data = {
                page,
                totalPages,
                getFaqsData,
                totalItems
            };
            return data;
        });
    }
}
exports.default = AdminRepository;
