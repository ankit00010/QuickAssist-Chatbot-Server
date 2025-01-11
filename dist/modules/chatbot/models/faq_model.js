"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../../../middleware/error"));
//Dummy Json Data 
// {
//     "question": "Dummy question?",
//     "answer": "Dummy answer",
//     "keywords": [
//         "dummyKeyword"
//     ],
//     "context": "dummy"
// }
/**
 * Represents an FAQ item with validation logic.
 */
class FaqInfo {
    /**
     * Constructor to initialize FAQ details.
     * @param faqInfo - The FAQ item details.
     */
    constructor(faqInfo) {
        this.question = faqInfo.question;
        this.answer = faqInfo.answer;
        this.keywords = faqInfo.keywords;
        this.context = faqInfo.context;
        this.validateFields(); // Validate fields upon initialization.
    }
    /**
     * Validates the fields of the FAQ item.
     * Throws an error if any required field is invalid.
     */
    validateFields() {
        if (!this.question) {
            throw new error_1.default(400, "Validation Error", "Question is required.");
        }
        if (!this.context) {
            throw new error_1.default(400, "Validation Error", "Context is required.");
        }
        if (!this.answer) {
            throw new error_1.default(400, "Validation Error", "Answer is required.");
        }
        if (!Array.isArray(this.keywords) || this.keywords.length === 0) {
            throw new error_1.default(400, "Validation Error", "At least one valid keyword is required.");
        }
    }
}
exports.default = FaqInfo;
