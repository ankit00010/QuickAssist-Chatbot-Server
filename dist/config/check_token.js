"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
class AuthMiddleware {
}
exports.AuthMiddleware = AuthMiddleware;
AuthMiddleware.SECRET_KEY = process.env.JWT_SECRET || "";
// Middleware to authenticate token
AuthMiddleware.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log("Token :=>", token);
    // Check if token exists
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
        return;
    }
    // Verify token
    jsonwebtoken_1.default.verify(token, AuthMiddleware.SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({
                    success: false,
                    message: "Token has expired"
                });
                return;
            }
            res.status(403).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }
        // Add role to request object
        req.role = decoded;
        next();
    });
};
// Middleware to check admin role
AuthMiddleware.isAdmin = (req, res, next) => {
    var _a;
    if (!((_a = req.role) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        res.status(403).json({
            success: false,
            message: "Access denied. Admin rights required."
        });
        return;
    }
    next();
};
