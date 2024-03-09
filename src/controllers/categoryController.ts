import { Request, Response } from 'express';
import { Category } from '../models/category';
import { categoryService } from '../services/categoryService';
import { CommonResponseData } from '../dtos/common/commonResponseData';
import * as categoryDto from '../dtos/categories/category.dto';


export const createCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const reqBody: categoryDto.CreateCategoryRequest = req.body;
        const newCategory = categoryService.createCategory(reqBody, currentUser?.id ?? 'unknown');
        if (!newCategory) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Something went wrong',
                data: {}
            };
            res.status(500).json(commonResponse);
            return;
        }
        const commonResponse: CommonResponseData<categoryDto.CreateCategoryResponseData> = {
            status: true,
            message: 'Category created successfully',
            data: newCategory
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

export const updateCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;
        const updatedCategoryData: categoryDto.UpdateCategoryRequest = req.body;
        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Category not found',
                data: {}
            };
            res.status(404).json(commonResponse);
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to update this category',
                data: {}
            };
            res.status(403).json(commonResponse);
            return;
        }

        const updatedCategory: Category | undefined = categoryService.updateCategory(categoryId, updatedCategoryData);
        if (!updatedCategory) {
            const commonResponse: CommonResponseData<{}> = {
                status: false,
                message: 'Something went wrong',
                data: {}
            };
            res.status(500).json(commonResponse);
            return;
        }

        const commonResponse: CommonResponseData<categoryDto.UpdateCategoryResponseData> = {
            status: true,
            message: 'Category updated successfully',
            data: updatedCategory
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

export const deleteCategory = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;

        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Category not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to delete this category',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const isDeleted = categoryService.deleteCategory(categoryId);

        if (!isDeleted) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Failed to delete category',
                data: {},
            };
            res.status(500).json(response);
            return;
        }
        const commonResponse: CommonResponseData<categoryDto.DeleteCategoryResponseData> = {
            status: true,
            message: 'Category deleted successfully',
            data: { id: categoryId }
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

export const getCategoryById = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const categoryId: string = req.params.id;

        const existingCategory = categoryService.getCategoryById(categoryId);

        if (!existingCategory) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Category not found',
                data: {},
            };
            res.status(404).json(response);
            return;
        }

        if (existingCategory.createdBy !== currentUser?.id) {
            const response: CommonResponseData<{}> = {
                status: false,
                message: 'Forbidden: You are not authorized to view this category',
                data: {},
            };
            res.status(403).json(response);
            return;
        }

        const response: CommonResponseData<categoryDto.GetCategoryByIdResponse> = {
            status: true,
            message: 'Category fetched successfully',
            data: existingCategory,
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


export const getAllCategories = (req: Request, res: Response): void => {
    try {
        const currentUser = req.user;
        const { page = 1, limit = 10, searchQuery }: categoryDto.GetAllCategoriesRequest = req.query;

        const getAllCategoriesRequest: categoryDto.GetAllCategoriesRequest = {
            page: +page,
            limit: +limit,
            searchQuery: searchQuery,
        };
        
        const { rows, pagination }: categoryDto.GetAllCategoriesResponseData = categoryService.getAllCategories(getAllCategoriesRequest, currentUser?.id);
        
        const commonResponse: CommonResponseData<categoryDto.GetAllCategoriesResponseData> = {
            status: true,
            message: 'Categories fetched successfully',
            data: { rows, pagination }
        };

        res.status(200).json(commonResponse);
    } catch (error: any) {
        const response: CommonResponseData<{}> = {
            status: false,
            message: error.message || 'Something went wrong',
            data: {}
        };
        res.status(500).json(response);
    }
};
