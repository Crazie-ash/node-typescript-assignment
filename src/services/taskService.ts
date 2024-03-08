import { Task } from "../models/task";
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus } from '../enums/TaskStatus';
import { categoryService } from '../services/categoryService';
import { User } from "../models/user";
import { userService } from "./userService";

interface PaginationSummary {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
class TaskService {
    private tasks: Task[] = [];

    public createTask(task: Task): Task {
        const { title, assignedTo, categoryId, createdBy, description, dueDate } = task;
        const newTask: Task = {
            id: uuidv4(),
            title,
            assignedTo,
            categoryId,
            createdBy,
            description,
            dueDate,
            createdAt: new Date(),
            status: TaskStatus.Pending
        };

        this.tasks.push(newTask);
        return newTask;
    }

    public getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    public updateTask(id: string, updatedTask: Task): Task | undefined {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedTask };
            return this.tasks[index];
        }
        return undefined;
    }

    public deleteTask(id: string): boolean {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    public getAllTasks(page: number = 1, limit: number = 10, searchQuery?: string, assignedTo?: string, category?: string, currentUserId?: string): { rows: Task[], pagination: PaginationSummary } {
        let filteredTasks = this.tasks;

        if (currentUserId) {
            filteredTasks = filteredTasks.filter(task => task.createdBy === currentUserId);
        }

        if (assignedTo) {
            const assignedUser: User | undefined = userService.getUserByUsername(assignedTo);
            if (assignedUser) {
                filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedUser.id);
            }
        }

        if (category) {
            const categoryLowered = category.toLowerCase();
            filteredTasks = filteredTasks.filter(task => {
                const taskCategory = categoryService.getCategoryById(task.categoryId);
                return taskCategory && taskCategory.title.toLowerCase() === categoryLowered;
            });
        }

        if (searchQuery) {
            const searchQueryLowered = searchQuery.toLowerCase();
            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchQueryLowered));
        }

        const totalRows = filteredTasks.length;
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
        const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

        return { rows: paginatedTasks, pagination: paginationSummary };
    }

}

export const taskService = new TaskService();
