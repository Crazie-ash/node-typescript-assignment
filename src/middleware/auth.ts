import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { userService } from '../services/userService';
import { JWT_EXPIRES, JWT_SECRET } from '../config/config';
import { UserRole } from '../enums/UserRole';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export const generateToken = (user: User): string => {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

export const verifyToken = (roles: UserRole[]) => (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ status: false, message: 'Unauthorized: Missing token', data: {} });
        return;
    }
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Unauthorized: Invalid token', data: {} });
        }
        const currentUser = userService.getUserById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: false, message: 'Unauthorized', data: {} });
        }
        if (!roles.includes(currentUser.role)) {
            return res.status(403).json({ status: false, message: 'Forbidden: Access denied', data: {} });
        }
        req.user = currentUser;
        next();
    });
};
