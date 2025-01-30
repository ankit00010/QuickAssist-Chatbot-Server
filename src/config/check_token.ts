import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extend the Request interface to include role
declare global {
    namespace Express {
        interface Request {
            role?: {
                isAdmin: boolean;
            };
        }
    }
}

// Interface for JWT payload
interface JWTPayload {
    isAdmin: boolean;
}

export class AuthMiddleware {
    private static readonly SECRET_KEY = process.env.JWT_SECRET || "";

    // Middleware to authenticate token
    static authenticateToken = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        console.log("Token :=>",token);
        
        // Check if token exists
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
            return;
        }

        // Verify token
        jwt.verify(token, AuthMiddleware.SECRET_KEY, (err, decoded) => {
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
            req.role = decoded as JWTPayload;
            next();
        });
    };

    // Middleware to check admin role
    static isAdmin = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.role?.isAdmin) {
            res.status(403).json({
                success: false,
                message: "Access denied. Admin rights required."
            });
            return;
        }
        next();
    };
}