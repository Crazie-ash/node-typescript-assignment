import { User } from "../../models/user";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponseData extends Omit<User, 'password'> {
    token: string;
}