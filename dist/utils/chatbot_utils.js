"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatBotUtils {
    //To generate the id based on current year and  month
    static generateDocumentId(totalDocs) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const count = String(totalDocs + 1).padStart(4, '0');
        return `${year}${month}${count}`;
    }
}
exports.default = ChatBotUtils;
