import { TaskStatus } from "../enums/TaskStatus";
import { BaseEntity } from "./base";

export interface Task extends BaseEntity {
  title: string;
  description: string;
  dueDate: Date;
  assignedTo: string;
  categoryId: string;
  status: TaskStatus;
}
