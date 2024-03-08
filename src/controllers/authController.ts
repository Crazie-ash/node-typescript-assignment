import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateToken } from '../middleware/auth';
import { userService } from '../services/userService';
import bcrypt from 'bcryptjs';

export const createUser = (req: Request, res: Response): void => {
    try {
        const { password, confirmPassword, ...userData } = req.body;
        
        if (userService.isEmailExists(userData.email)) {
            res.status(400).json({ status: false, message: 'Email already exists', data: {} });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ status: false, message: 'Passwords do not match', data: {} });
            return;
        }

        const newUser: User = {
            ...userData,
            password: password
        };

        const createdUser = userService.createUser(newUser);
        const token = generateToken(createdUser);
        const responseData = {
            id: createdUser.id,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            token: token
        };
        res.status(201).json({ status: true, message: 'User created successfully', data: responseData });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const loginUser = (req: Request, res: Response): void => {
    try {
        const { email, password } = req.body;
        const users = userService.getAllUsers().rows;

        const user = users.find(user => user.email === email);
        if (!user) {
            res.status(401).json({ status: false, message: 'Invalid credentials', data: {} });
            return;
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ status: false, message: 'Invalid credentials', data: {} });
            return;
        }

        const token = generateToken(user);

        const responseData = {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            token: token
        };
        res.status(200).json({ status: true, message: 'Login successful', data: responseData });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

