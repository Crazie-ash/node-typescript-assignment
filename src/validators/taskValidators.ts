import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '../enums/TaskStatus';

export const taskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().iso().required(),
    assignedTo: Joi.string().required(),
    categoryId: Joi.string().required(),
    status: Joi.string().valid(TaskStatus.Pending, TaskStatus.Completed).required()
});

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = taskSchema.validate(req.body);

    if (error) {
        res.status(400).json({ status: false, message: error.message, data: {} });
        return;
    }

    next();
};
