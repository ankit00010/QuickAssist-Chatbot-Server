import ThrowError from "../../../middleware/error";

/**
 * Represents the structure of an FAQ item.
 */
export interface FaqInfoProps {
    question: string; // The FAQ question.
    answer: string; // The FAQ answer.
    keywords: string[]; // Keywords for search functionality.
    context: string; // Context or category of the FAQ.
}
// Interface to define the structure of potential validation error messages
export interface errorsProps {
    question_error?: string; // Error message for an invalid question.
    answer_error?: string;   // Error message for an invalid answer.
    keywords_error?: string; // Error message for invalid keywords.
    context_error?: string;  // Error message for an invalid context.
}

// Interface to define the structure of fields that can be edited in an FAQ
export interface editFields {
    question?: string;  // The FAQ question, optional for partial updates.
    answer?: string;    // The FAQ answer, optional for partial updates.
    keywords?: string[]; // Keywords for search functionality, optional.
    context?: string;   // Context or category of the FAQ, optional.
}

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
    question: string;
    answer: string;
    keywords: string[];
    context: string;

    /**
     * Constructor to initialize FAQ details.
     * @param faqInfo - The FAQ item details.
     */
    constructor(faqInfo: FaqInfoProps) {
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
    private validateFields(): void {
        if (!this.question) {
            throw new ThrowError(400, "Validation Error", "Question is required.");
        }

        if (!this.context) {
            throw new ThrowError(400, "Validation Error", "Context is required.");
        }

        if (!this.answer) {
            throw new ThrowError(400, "Validation Error", "Answer is required.");
        }

        if (!Array.isArray(this.keywords) || this.keywords.length === 0) {
            throw new ThrowError(400, "Validation Error", "At least one valid keyword is required.");
        }
    }
}

export default FaqInfo;
