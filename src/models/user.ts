import { UserRole } from "../enums/UserRole";

export interface User {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    createdBy: string
}
