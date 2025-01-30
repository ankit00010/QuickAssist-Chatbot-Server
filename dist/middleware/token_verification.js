"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authenticate = () => {
    return (req, res, next) => {
        // Your authentication logic here
        if (!req.user || (requiredRole && req.user.role !== requiredRole)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.default = authenticate;
