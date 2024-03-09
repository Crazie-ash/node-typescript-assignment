import { Category } from "../../models/category";
import { PaginationSummary } from "../common/pagination";

export interface CreateCategoryRequest {
    title: string;
}

export interface CreateCategoryResponseData extends Category {}

export interface UpdateCategoryRequest extends CreateCategoryRequest {}

export interface UpdateCategoryResponseData extends Category {}

export interface DeleteCategoryResponseData {
    id: string;
}

export interface GetCategoryByIdRequest {
    id: string;
}

export interface GetCategoryByIdResponse extends Category {}

export interface GetAllCategoriesRequest {
    page?: number;
    limit?: number;
    searchQuery?: string;
}

export interface GetAllCategoriesResponseData {
    rows: Category[];
    pagination: PaginationSummary;
}