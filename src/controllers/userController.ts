import { Request, Response } from 'express';
import { User } from '../models/user';
import { userService } from '../services/userService';

export const createUser = (req: Request, res: Response): void => {
    try {
        const user: User = req.body;
        const newUser = userService.createUser(user);
        res.status(201).json({ status: true, message: 'User created successfully', data: newUser });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const updateUser = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;
        const updatedUserData: User = req.body;

        if (currentUser?.id !== userId) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to update this user', data: {} });
            return;
        }

        const updatedUser = userService.updateUser(userId, updatedUserData);
        if (!updatedUser) {
            res.status(404).json({ status: false, message: 'User not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'User updated successfully', data: updatedUser });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const deleteUser = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;

        if (currentUser?.id !== userId) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to delete this user', data: {} });
            return;
        }

        const isDeleted = userService.deleteUser(userId);
        if (!isDeleted) {
            res.status(404).json({ status: false, message: 'User not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'User deleted successfully', data: {} });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};


export const getUserById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;

        const user = userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ status: false, message: 'User not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'User fetched successfully', data: user });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const getAllUsers = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery } = req.query;
        
        const users = userService.getAllUsers(+page, +limit, searchQuery as string);
        res.status(200).json({ status: true, message: 'Users fetched successfully', data: users });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};