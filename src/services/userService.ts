import { User } from "../models/user";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { UserRole } from "../enums/UserRole";

interface PaginationSummary {
    totalRows: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
class UserService {
    private users: User[] = [];

    public createUser(user: User): User {
        const { username, password } = user; 
        const hashedPassword = bcrypt.hashSync(password, 10); 

        const newUser: User = {
            id: uuidv4(),
            username,
            role: UserRole.USER,
            createdAt: new Date(),
            password: hashedPassword
        };

        this.users.push(newUser);
        return newUser;
    }

    public isUsernameExists(username: string): boolean {
        return this.users.some(user => user.username === username);
    }

    public getUserByUsername(username: string): User | undefined {
        const lowerCaseUsername = username.toLowerCase(); 
        return this.users.find(user => user.username.toLowerCase() === lowerCaseUsername);
    }
    
    public getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public updateUser(id: string, updatedUser: User): User | undefined {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index];
        }
        return undefined;
    }

    public deleteUser(id: string): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    public getAllUsers(page: number = 1, limit: number = 10, searchQuery: string = ''): { rows: User[], pagination: PaginationSummary } {
        let filteredUsers = this.users;

        if (searchQuery.trim() !== '') {
            const searchRegex = new RegExp(searchQuery, 'i');
            filteredUsers = filteredUsers.filter(user => searchRegex.test(user.username));
        }

        const totalRows = filteredUsers.length;
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
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return { rows: paginatedUsers, pagination: paginationSummary };
    }
}

export const userService = new UserService();
