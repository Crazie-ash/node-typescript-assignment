import { Task } from "../models/task";
import { v4 as uuidv4 } from 'uuid';

class TaskService {
    private tasks: Task[] = [];

    public createTask(task: Task): Task {
        const newTask: Task = {
            ...task,
            id: uuidv4(),
            creationDate: new Date(),
            status: 'Pending'
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

    public getAllTasks(page: number = 1, limit: number = 10, assignedTo?: string, category?: string): Task[] {
        let filteredTasks = this.tasks;

        if (assignedTo) {
            filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedTo);
        }

        if (category) {
            filteredTasks = filteredTasks.filter(task => task.category === category);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        return filteredTasks.slice(startIndex, endIndex);
    }

}

export const taskService = new TaskService();
