import { Request, Response } from 'express';
import { User } from '../models/user';
import { generateToken } from '../middleware/auth';
import { userService } from '../services/userService';
import bcrypt from 'bcryptjs';
import { UserRole } from '../enums/UserRole';
import { CommonResponseData } from '../dtos/common/commonResponseData';
import { CreateUserRequest, CreateUserResponseData } from '../dtos/users/user.dto';
import { LoginRequest, LoginResponseData } from '../dtos/auth/login.dto';


export const createUser = (req: Request, res: Response): void => {
    try {
        const { password, confirmPassword, username, role }: CreateUserRequest = req.body;

        if (userService.isUsernameExists(username)) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Username already exists',
                data: {}
            };
            res.status(400).json(commonResponse);
            return;
        }

        if (password !== confirmPassword) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Passwords do not match',
                data: {}
            };
            res.status(400).json(commonResponse);
            return;
        }

        const newUser: Partial<User> = {
            username,
            role: role || UserRole.USER,
            password: password
        };

        const createdUser = userService.createUser(newUser);
        const token = generateToken(createdUser);
        const commonResponse: CommonResponseData<CreateUserResponseData> = {
            status: true,
            message: 'User created successfully',
            data: {
                ...createdUser, token
            }
        };
        res.status(201).json(commonResponse);
    } catch (error: any) {
        const commonResponse: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {}
        };
        res.status(500).json(commonResponse);
    }
};

export const loginUser = (req: Request, res: Response): void => {
    try {
        const { username, password }: LoginRequest = req.body;
        const users = userService.getAllUsers().rows;

        const user = users.find(user => user.username === username);
        if (!user) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Invalid credentials',
                data: {}
            };
            res.status(401).json(commonResponse);
            return;
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Invalid credentials',
                data: {}
            };
            res.status(401).json(commonResponse);
            return;
        }
        const token = generateToken(user);

        const commonResponse: CommonResponseData<LoginResponseData> = {
            status: true,
            message: 'Login successful',
            data: {
                ...user,
                token: token
            }
        };

        res.status(200).json(commonResponse);
    } catch (error: any) {
        const commonResponse: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {}
        };
        res.status(500).json(commonResponse);
    }
};

