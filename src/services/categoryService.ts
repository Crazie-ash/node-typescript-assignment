import { Category } from "../models/category";
import { v4 as uuidv4 } from 'uuid';

interface PaginationSummary {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
class CategoryService {
    private categories: Category[] = [];

    public createCategory(category: Category): Category {
        const newCategory: Category = {
            ...category,
            id: uuidv4(),
            createdAt: new Date(),
        };
        this.categories.push(newCategory);
        return newCategory;
    }

    public getCategoryById(id: string): Category | undefined {
        return this.categories.find(category => category.id === id);
    }

    public updateCategory(id: string, updatedCategory: Category): Category | undefined {
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            this.categories[index] = { ...this.categories[index], ...updatedCategory };
            return this.categories[index];
        }
        return undefined;
    }

    public deleteCategory(id: string): boolean {
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
            return true;
        }
        return false;
    }
    
    public getAllCategories(page: number = 1, limit: number = 10, searchQuery?: string, currentUserId?: string): { rows: Category[], pagination: PaginationSummary } {
        let filteredCategories = this.categories;

        if (currentUserId) {
            filteredCategories = filteredCategories.filter(category => category.createdBy === currentUserId);
        }

        if (searchQuery) {
            const searchQueryLowered = searchQuery.toLowerCase();
            filteredCategories = filteredCategories.filter(category => category.title.toLowerCase().includes(searchQueryLowered));
        }

        const totalRows = filteredCategories.length;
        const totalPages = Math.ceil(totalRows / limit);
        const currentPage = page;

        const paginationSummary: PaginationSummary = {
            totalRows,
            totalPages,
            currentPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        };

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

        return { rows: paginatedCategories, pagination: paginationSummary };
    }

}

export const categoryService = new CategoryService();