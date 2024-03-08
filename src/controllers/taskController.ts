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
        const taskId: string = req.params.id;
        const updatedTaskData: Task = req.body;
        const updatedTask = taskService.updateTask(taskId, updatedTaskData);
        if (!updatedTask) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'Task updated successfully', data: updatedTask });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const deleteTask = (req: Request, res: Response): void => {
    try {
        const taskId: string = req.params.id;
        const isDeleted = taskService.deleteTask(taskId);
        if (!isDeleted) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'Task deleted successfully', data: {} });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};


export const getTaskById = (req: Request, res: Response): void => {
    try {
        const taskId: string = req.params.id;
        const task = taskService.getTaskById(taskId);
        if (!task) {
            res.status(404).json({ status: false, message: 'Task not found', data: {} });
            return;
        }
        res.status(200).json({ status: true, message: 'Task fetched successfully', data: task });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const getAllTasks = (req: Request, res: Response): void => {
    try {
        const { page = 1, limit = 10, assignedTo, category } = req.query;
        const tasks = taskService.getAllTasks(+page, +limit, assignedTo as string, category as string);
        res.status(200).json({ status: true, message: 'Tasks fetched successfully', data: tasks });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};