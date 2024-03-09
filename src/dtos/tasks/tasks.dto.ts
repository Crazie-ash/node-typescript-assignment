import { TaskStatus } from "../../enums/TaskStatus";
import { Category } from "../../models/category";
import { Task } from "../../models/task";
import { User } from "../../models/user";
import { PaginationSummary } from "../common/pagination";

export interface CreateTaskRequest {
    title: string;
    description: string;
    assignedTo: string;
    categoryId: string;
    dueDate: Date;
}

export interface CreateTaskResponseData extends Task {}

export interface UpdateTaskRequest extends CreateTaskRequest {
    status?: TaskStatus;
}

export interface UpdateTaskResponseData extends Task {}

export interface DeleteTaskResponseData {
    id: string;
}

export interface GetTaskByIdResponseData extends Task {}

export interface GetAllTasksRequest {
    page?: number;
    limit?: number;
    searchQuery?: string;
    assignedTo?: string;
    category?: string;
}

export interface GetAllTasksResponseData {
    rows: TaskWithDetails[];
    pagination: PaginationSummary;
}

export interface TaskWithDetails extends Task {
    assignedToDetail: User;
    categoryDetail: Category;
}