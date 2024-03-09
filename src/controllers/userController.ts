import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { CommonResponseData } from '../dtos/common/commonResponseData';
import * as userDto from '../dtos/users/user.dto';

export const updateUser = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;
        const updatedUserData: userDto.UpdateUserRequest = req.body;

        if (currentUser?.id !== userId) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to update this user',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const updatedUser = userService.updateUser(userId, updatedUserData);
        if (!updatedUser) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'User not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        const response: CommonResponseData<userDto.UpdateUserResponseData> = {
            status: true,
            message: 'User updated successfully',
            data: updatedUser,
        };
        res.status(200).json(response);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {},
        };
        res.status(500).json(response);
    }
};

export const deleteUser = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;

        if (currentUser?.id !== userId) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to delete this user',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const isDeleted = userService.deleteUser(userId);
        if (!isDeleted) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'User not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }
        const response: CommonResponseData<userDto.DeleteUserResponseData> = {
            status: true,
            message: 'User deleted successfully',
            data: { id: userId },
        };
        res.status(200).json(response);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {},
        };
        res.status(500).json(response);
    }
};


export const getUserById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const userId: string = req.params.id;

        const user = userService.getUserById(userId);
        if (!user) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'User not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }
        const response: CommonResponseData<userDto.GetUserByIdResponseData> = {
            status: true,
            message: 'User fetched successfully',
            data: user,
        };
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const getAllUsers = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery } = req.query;

        const getAllUsersRequest: userDto.GetAllUsersRequest = {
            page: +page,
            limit: +limit,
            searchQuery: searchQuery as string,
        };
        
        const { rows, pagination }: userDto.GetAllUsersResponseData = userService.getAllUsers(getAllUsersRequest);
        
        const response: CommonResponseData<userDto.GetAllUsersResponseData> = {
            status: true,
            message: 'Users fetched successfully',
            data: { rows, pagination }
        };
        res.status(200).json(response);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {},
        };
        res.status(500).json(response);
    }
};