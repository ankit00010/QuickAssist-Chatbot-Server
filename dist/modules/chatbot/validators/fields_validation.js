"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validatiors {
    // Static method to validate the provided fields
    static validateFields(fields) {
        const errors = {};
        console.log("Fields Data in a validation", fields.answer);
        // Validate the 'question' field if it's provided
        if (fields.question !== undefined) {
            if (typeof fields.question !== "string" || fields.question.trim() === "") {
                errors.question_error = "Invalid question"; // Add an error if the question is not a valid string
            }
        }
        // Validate the 'answer' field if it's provided
        if (fields.answer !== undefined) {
            if (typeof fields.answer !== "string" || fields.answer.trim() === "") {
                errors.answer_error = "Invalid answer"; // Add an error if the answer is not a valid string
            }
        }
        // Validate the 'keywords' field if it's provided
        if (fields.keywords !== undefined) {
            if (!Array.isArray(fields.keywords)) {
                errors.keywords_error = "Invalid keywords"; // Add an error if keywords are not in array format
            }
        }
        // Validate the 'context' field if it's provided
        if (fields.context !== undefined) {
            if (typeof fields.context !== "string" || fields.context.trim() === "") {
                errors.context_error = "Invalid context"; // Add an error if the context is not a valid string
            }
        }
        // Return the errors if any are found, otherwise return null
        return Object.keys(errors).length ? errors : null;
    }
}
exports.default = Validatiors;
