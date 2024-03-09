import { Task } from "../models/task";
import { v4 as uuidv4 } from 'uuid';
import { TaskStatus } from '../enums/TaskStatus';
import { categoryService } from '../services/categoryService';
import { User } from "../models/user";
import { userService } from "./userService";
import { PaginationSummary } from '../dtos/common/pagination';
import * as tasksDto from "../dtos/tasks/tasks.dto";

class TaskService {
    private tasks: Task[] = [];

    public createTask(task: tasksDto.CreateTaskRequest, createdBy: string): tasksDto.CreateTaskResponseData {
        const { title, assignedTo, categoryId, description, dueDate } = task;
        const newTask: tasksDto.CreateTaskResponseData = {
            id: uuidv4(),
            title: title.trim(),
            assignedTo,
            categoryId,
            createdBy,
            description: description.trim(),
            dueDate,
            createdAt: new Date(),
            status: TaskStatus.Pending,
            isActive: true,
            isDeleted: false,
        };

        this.tasks.push(newTask);
        return newTask;
    }


    public getTaskById(id: string): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    public updateTask(id: string, updatedTask: tasksDto.UpdateTaskRequest): Task | undefined {
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

    public getAllTasks(request: tasksDto.GetAllTasksRequest, currentUserId?: string): tasksDto.GetAllTasksResponseData {
        let { page = 1, limit = 10, searchQuery, assignedTo, category } = request;

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
                return taskCategory && taskCategory.title.toLowerCase().includes(categoryLowered);
            });
        }

        if (searchQuery) {
            const searchQueryLowered = searchQuery.toLowerCase();
            filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchQueryLowered));
        }

        const tasksWithDetails = filteredTasks.map(task => {
            const assignedToDetail = userService.getUserById(task.assignedTo)!;
            const categoryDetail = categoryService.getCategoryById(task.categoryId)!;
            return { ...task, assignedToDetail, categoryDetail };
        });

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
        const paginatedTasks = tasksWithDetails.slice(startIndex, endIndex);

        return { rows: paginatedTasks, pagination: paginationSummary };
    }

}

export const taskService = new TaskService();
