import { Request, Response } from 'express';
import { Task } from '../models/task';
import { taskService } from '../services/taskService';

export const createTask = (req: Request, res: Response): void => {
    try {
        const task: Task = req.body;
        const newTask = taskService.createTask(task);
        res.status(201).json({ status: true, message: 'Task created successfully', data: newTask });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const updateTask = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;
        const updatedTaskData: Task = req.body;

        const existingTask = taskService.getTaskById(taskId);

        if (!existingTask) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }

        if (existingTask.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to update this task', data: {} });
            return;
        }

        const updatedTask = taskService.updateTask(taskId, updatedTaskData);
        res.status(200).json({ status: true, message: 'Task updated successfully', data: updatedTask });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const deleteTask = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;

        const taskToDelete = taskService.getTaskById(taskId);

        if (!taskToDelete) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }

        if (taskToDelete.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to delete this task', data: {} });
            return;
        }

        const isDeleted = taskService.deleteTask(taskId);

        if (!isDeleted) {
            res.status(500).json({ status: false, message: 'Failed to delete task', data: {} });
            return;
        }

        res.status(200).json({ status: true, message: 'Task deleted successfully', data: {} });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};


export const getTaskById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const taskId: string = req.params.id;
        const task = taskService.getTaskById(taskId);
        if (!task) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }

        if (task.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to update this task', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'Task fetched successfully', data: task });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const getAllTasks = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery, assignedTo, category } = req.query;
        
        const currentUserId = currentUser?.id as string;
        
        const tasks = taskService.getAllTasks(+page, +limit, searchQuery as string, assignedTo as string, category as string, currentUserId);
        
        res.status(200).json({ status: true, message: 'Tasks fetched successfully', data: tasks });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};