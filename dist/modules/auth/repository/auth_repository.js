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
const bcrypt_1 = __importDefault(require("bcrypt"));
const chatbot_utils_1 = __importDefault(require("../../../utils/chatbot_utils"));
class AuthRepository {
    static verifyUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const result = yield db.collection("admin_credentails").findOne({ email });
            if (!result) {
                throw new error_1.default(401, "Not Authorized", "Incorrect Email or Password");
            }
            console.log(result);
            const dbPassword = result.password;
            console.log("The dbPassword is :=> ", dbPassword);
            console.log("The password is :=> ", password);
            const verifyPassword = yield bcrypt_1.default.compare(password, dbPassword);
            console.log("Result : =>", verifyPassword);
            return verifyPassword;
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static storeCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Email", email);
            console.log("Password", password);
            const db = yield database_1.client.db("master");
            const result = yield db.collection("admin_credentails").insertOne({
                email: email,
                password: password,
            });
            return result.acknowledged;
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static generateOtp() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.client.db("master");
            const collection = db.collection("verification_otps");
            //Delete the previous otps if there is one
            yield collection.deleteMany({});
            // Generate OTP
            const otp = chatbot_utils_1.default.generateOtp();
            // Insert OTP with expiration time
            const result = yield collection.insertOne({
                otp,
                createdAt: new Date(),
            });
            if (!result.acknowledged) {
                throw new error_1.default(500, "FAILURE", "Something went wrong while generating the OTP");
            }
            // Ensure index exists for automatic expiration
            yield collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 });
            return otp;
        });
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static authOtpVerification(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield database_1.client.db("master");
            const getOtp = yield db.collection("verification_otps").findOne({});
            console.log(getOtp === null || getOtp === void 0 ? void 0 : getOtp.otp);
            if (getOtp && getOtp.otp !== null && getOtp.otp === otp) {
                return true;
            }
            return false;
        });
    }
}
exports.default = AuthRepository;
