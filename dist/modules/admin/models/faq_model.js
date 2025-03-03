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
    static validateMultipleFields(faqs) {
        return faqs
            .map((faq, index) => {
            var _a, _b, _c;
            const errors = {};
            if (!((_a = faq.question) === null || _a === void 0 ? void 0 : _a.trim())) {
                errors.question_error = `FAQ ${index + 1}: Question is required`;
            }
            if (!((_b = faq.answer) === null || _b === void 0 ? void 0 : _b.trim())) {
                errors.answer_error = `FAQ ${index + 1}: Answer is required`;
            }
            if (!((_c = faq.context) === null || _c === void 0 ? void 0 : _c.trim())) {
                errors.context_error = `FAQ ${index + 1}: Context is required`;
            }
            if (!Array.isArray(faq.keywords) || faq.keywords.length === 0 || faq.keywords.some(k => !k.trim())) {
                errors.keywords_error = `FAQ ${index + 1}: At least one valid keyword is required`;
            }
            return Object.keys(errors).length > 0 ? errors : null;
        })
            .filter((error) => error !== null); // Type assertion to filter out null
    }
}
exports.default = FaqInfo;
