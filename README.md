# Authentication API

A NestJS authentication API featuring JWT-based login, user management, and Swagger documentation.

## Features

User signup with email and password

Password hashing using bcrypt

User login with JWT token generation

Fetch user profile via JWT

Update user information including password

Delete users

Optional user settings stored in a separate collection

Validation with class-validator

Swagger API documentation

## Tech Stack

NestJS – Backend framework

MongoDB – Database

Mongoose – ODM

JWT – Authentication

bcrypt – Password hashing

Swagger – API documentation

## API Endpoints

### Auth

| Method | Route       | Description                           |
| ------ | ----------- | ------------------------------------- |
| POST   | /auth/login | Login and receive JWT token           |
| GET    | /auth/me    | Get user profile (requires JWT token) |

### Users

| Method | Route         | Description               |
| ------ | ------------- | ------------------------- |
| POST   | /users/signup | Create a new user         |
| GET    | /users        | Get all users             |
| GET    | /users/:id    | Get a specific user by ID |
| PATCH  | /users/:id    | Update user information   |
| DELETE | /users/:id    | Delete user by ID         |

## Notes

Password hashing: User passwords are stored securely using bcrypt.

JWT Authentication: Use the token from /auth/login in the Authorization header with Bearer <token>.

Validation: DTOs enforce required fields, optional fields, and custom validation messages.
