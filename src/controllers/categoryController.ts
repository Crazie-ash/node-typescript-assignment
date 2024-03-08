import { Request, Response } from 'express';
import { Category } from '../models/category';
import { categoryService } from '../services/categoryService';

export const createCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { title } = req.body;
        const newCategory = categoryService.createCategory({ title, createdBy: currentUser?.id ?? 'unknown' });
        res.status(201).json({ status: true, message: 'Category created successfully', data: newCategory });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const updateCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;
        const updatedCategoryData: Category = req.body;
        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            res.status(404).json({ status: false, message: 'Category not found', data: {} });
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to update this category', data: {} });
            return;
        }

        const updatedCategory = categoryService.updateCategory(categoryId, updatedCategoryData);

        res.status(200).json({ status: true, message: 'Category updated successfully', data: updatedCategory });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const deleteCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;

        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            res.status(404).json({ status: false, message: 'Category not found', data: {} });
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to delete this category', data: {} });
            return;
        }

        const isDeleted = categoryService.deleteCategory(categoryId);

        if (!isDeleted) {
            res.status(500).json({ status: false, message: 'Failed to delete category', data: {} });
            return;
        }

        res.status(200).json({ status: true, message: 'Category deleted successfully', data: {} });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};

export const getCategoryById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;

        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            res.status(404).json({ status: false, message: 'Category not found', data: {} });
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            res.status(403).json({ status: false, message: 'Forbidden: You are not authorized to view this category', data: {} });
            return;
        }

        res.status(200).json({ status: true, message: 'Category fetched successfully', data: existingCategory });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};


export const getAllCategories = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery } = req.query;

        const categories = categoryService.getAllCategories(+page, +limit, searchQuery as string, currentUser?.id);

        res.status(200).json({ status: true, message: 'Categories fetched successfully', data: categories });
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message || 'Something went wrong', data: {} });
    }
};
