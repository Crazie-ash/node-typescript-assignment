import { UserRole } from "../enums/UserRole";

export interface User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    createdBy: string
}
