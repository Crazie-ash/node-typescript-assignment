# Task Manager Backend

## Overview

This project implements a RESTful API for a simple task management system. Users can create tasks, assign them to other users, mark tasks as complete, and categorize tasks.

## Setup & Initial Configuration

To set up the project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables (e.g., database connection details, JWT secret).
4. Run the server: `npm start`
5. Access the API endpoints using a tool like Postman.

## API Documentation

The API is documented using Postman. You can find the Postman collection [here](link-to-postman-collection).

## Endpoints

- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login and generate authentication token.
- `POST /api/v1/categories`: Create a new category (requires authentication).
- `PUT /api/v1/categories/:id`: Update a specific category (requires authentication).
- `DELETE /api/v1/categories/:id`: Delete a specific category (requires authentication).
- `GET /api/v1/categories/:id`: Retrieve a category by its ID (requires authentication).
- `GET /api/v1/categories`: Retrieve all categories (requires authentication).
- `POST /api/v1/tasks`: Create a new task (requires authentication).
- `PUT /api/v1/tasks/:id`: Update a specific task (requires authentication).
- `DELETE /api/v1/tasks/:id`: Delete a specific task (requires authentication).
- `GET /api/v1/tasks/:id`: Retrieve a task by its ID (requires authentication).
- `GET /api/v1/tasks`: Retrieve all tasks (requires authentication).
- `PUT /api/v1/users/:id`: Update a specific user (requires authentication).
- `DELETE /api/v1/users/:id`: Delete a specific user (requires authentication).
- `GET /api/v1/users/:id`: Retrieve a user by its ID (requires authentication).
- `GET /api/v1/users`: Retrieve all users (requires authentication).

## Authentication

User registration and login are handled through the `/auth/register` and `/auth/login` endpoints, respectively. Upon successful login, a JWT token is generated, which should be included in the `Authorization` header for accessing protected routes.

## Authorization

Certain routes, such as creating, updating, and deleting categories, tasks, and users, require authentication and authorization. The `verifyToken` middleware ensures that only authenticated users with the appropriate role (admin or user) can access these routes.


## Data Model

### User Model Attributes:

- **ID**: Unique Identifier.
- **Username**: Username of the user.
- **Password**: Password of the user.
- **Role**: Role of the user (ADMIN/USER).
- **Creation Date**: Date when the user was created.
- **Created By**: Username of the user who created this user.

### Task Model Attributes:

- **ID**: Unique Identifier.
- **Title**: Title of the task.
- **Description**: Description of the task.
- **Creation Date**: Date when the task was created.
- **Due Date**: Deadline for completing the task.
- **Assigned To**: Username of the user to whom the task is assigned.
- **Category**: ID of the category to which the task belongs.
- **Status**: Status of the task (Pending/Completed).

### Category Model Attributes:

- **ID**: Unique Identifier.
- **Title**: Title of the category.
- **Creation Date**: Date when the category was created.
- **Created By**: Username of the user who created this category.

### Enums:

#### TaskStatus:

- **Pending**: Represents a task that is pending.
- **Completed**: Represents a task that has been completed.

#### UserRole:

- **ADMIN**: Represents an admin user.
- **USER**: Represents a regular user.

## Assumptions

1. **Authentication and Authorization**: It is assumed that the backend includes authentication and authorization mechanisms to ensure that only authorized users can access certain endpoints or perform specific actions. This may involve using JSON Web Tokens (JWT) for authentication and role-based access control (RBAC) for authorization.

2. **User Roles**: The system distinguishes between two user roles: ADMIN and USER. ADMIN users  is assumed to be implemented have elevated privileges and can perform administrative tasks such as creating categories and managing users will be implemented if required, while regular USERs have restricted access and can primarily manage their own tasks.

3. **Validation**: Input validation is assumed to be implemented using a library like Joi to ensure that incoming data meets certain criteria before processing it further. This helps prevent security vulnerabilities and data inconsistencies.

4. **Error Handling**: The backend is expected to handle errors gracefully and return meaningful error messages to the client in case of invalid requests, server errors, or unauthorized access attempts.

## Liberty Taken Points

1. **Data Storage**: The `assignedTo` and `category` fields are stored as IDs rather than actual user or category names. This approach helps prevent data pollution and offers flexibility when joining existing data.

2. **Validation**: Although sample validation logic has been implemented, it hasn't been integrated into the provided routes. It can be integrated upon request or as per project requirements to ensure data integrity and security.

3. **Population**: In the provided models and routes, there's no explicit handling of population of related entities such as users, tasks, and categories. Depending on the project requirements and complexity, population logic can be implemented to fetch related data and populate it within responses for better data representation.

4. **Response Messages**: Currently, response messages are embedded within the route handlers. To improve code maintainability and reusability, these messages can be moved to a separate YAML file or constants file. This allows for easier management of response messages and facilitates localization if needed in the future.


## Testing

The project includes unit tests for each route using the Jest testing framework. You can run the tests using the command `npm test`.

