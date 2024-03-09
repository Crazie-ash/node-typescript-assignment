import { Request, Response } from 'express';
import { Task } from '../models/task';
import { taskService } from '../services/taskService';
import { CommonResponseData } from '../dtos/common/commonResponseData';
import * as tasksDto from '../dtos/tasks/tasks.dto';

export const createTask = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const reqBody: tasksDto.CreateTaskRequest = req.body;

        const newTask: tasksDto.CreateTaskResponseData = taskService.createTask(reqBody, currentUser?.id ?? 'unknown');

        const commonResponse: CommonResponseData<tasksDto.CreateTaskResponseData> = {
            status: true,
            message: 'Task created successfully',
            data: newTask
        };

        res.status(201).json(commonResponse);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {}
        };
        res.status(500).json(response);
    }
};

export const updateTask = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;
        const updatedTaskData: tasksDto.UpdateTaskRequest = req.body;

        const existingTask = taskService.getTaskById(taskId);

        if (!existingTask) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Task not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        if (existingTask.createdBy !== currentUser?.id) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to update this task',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const updatedTask: Task | undefined = taskService.updateTask(taskId, updatedTaskData);
        if (!updatedTask) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Failed to update task',
                data: {},
            };
            res.status(500).json(response);
            return;
        }

        const response: CommonResponseData<tasksDto.UpdateTaskResponseData> = {
            status: true,
            message: 'Task updated successfully',
            data: updatedTask,
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

export const deleteTask = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;

        const taskToDelete = taskService.getTaskById(taskId);

        if (!taskToDelete) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Task not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        if (taskToDelete.createdBy !== currentUser?.id) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to delete this task',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const isDeleted = taskService.deleteTask(taskId);

        if (!isDeleted) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Failed to delete task',
                data: {},
            };
            res.status(500).json(response);
            return;
        }

        const commonResponse: CommonResponseData<tasksDto.DeleteTaskResponseData> = {
            status: true,
            message: 'Task deleted successfully',
            data: { id: taskId }
        };
        res.status(200).json(commonResponse);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {},
        };
        res.status(500).json(response);
    }
};

export const getTaskById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;
        const task = taskService.getTaskById(taskId);
        if (!task) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Task not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        if (task.createdBy !== currentUser?.id) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to update this task',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const response: CommonResponseData<tasksDto.GetTaskByIdResponseData> = {
            status: true,
            message: 'Task fetched successfully',
            data: task,
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

export const getAllTasks = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery, assignedTo, category } = req.query;

        const currentUserId = currentUser?.id as string;

        const { rows, pagination }: tasksDto.GetAllTasksResponseData = taskService.getAllTasks(+page, +limit, searchQuery as string, assignedTo as string, category as string, currentUserId);

        const response: CommonResponseData<tasksDto.GetAllTasksResponseData> = {
            status: true,
            message: 'Tasks fetched successfully',
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