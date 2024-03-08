import { TaskStatus } from "../enums/TaskStatus";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  category: string;
  status: TaskStatus;
  createdAt: Date;
  createdBy: string
}
