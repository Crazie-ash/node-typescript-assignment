import { UserRole } from "../enums/UserRole";
import { BaseEntity } from "./base";

export interface User extends Omit<BaseEntity, 'createdBy'> {
    username: string;
    password: string;
    role: UserRole;
}
