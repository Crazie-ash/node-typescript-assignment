import { UserRole } from "../../enums/UserRole";
import { User } from "../../models/user";
import { PaginationSummary } from "../common/pagination";

export interface CreateUserRequest {
    username: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}

export interface CreateUserResponseData extends Omit<User, 'password'> {
    token: string;
}

export interface UpdateUserRequest {
    username?: string;
    password?: string;
    role?: UserRole;
}

export interface UpdateUserResponseData extends Omit<User, 'password'> {}

export interface DeleteUserResponseData {
    id: string;
}

export interface GetUserByIdResponseData extends User {}

export interface GetAllUsersRequest {
    page?: number;
    limit?: number;
    searchQuery?: string;
}

export interface GetAllUsersResponseData  {
    rows: Omit<User, 'password'>[];
    pagination: PaginationSummary;
}