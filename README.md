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

| Method | Route                     | Description                           |
| ------ | ------------------------- | ------------------------------------- |
| POST   | /auth/signup              | Create a new user                     |
| GET    | /auth/verify-email?token= | Verify email using verification token |
| POST   | /auth/login               | Login and receive JWT token           |
| GET    | /auth/forgot-password     | Send password reset email to user     |
| POST   | /auth/login               | Login and receive JWT token           |
| PATCH  | /auth/reset-password      | Reset password using reset token      |

#### Descriptions

`/auth/signup`

Creates a new user
→ Generates email verification token
→ Sends verification email
→ User cannot login until verified (isVerified = false)

`/auth/verify-email?token=`

Verifies email and activates account
→ Sets isVerified = true
→ Deletes verification token

`/auth/login`

Returns JWT only after user email is verified.

`/auth/forgot-password`

Sends a password reset link to
`/auth/reset-password?token=xxxx`

`/auth/reset-password`

Set a new password using the reset token.

### Users

| Method | Route      | Description               |
| ------ | ---------- | ------------------------- |
| GET    | /users     | Get all users             |
| GET    | /users/:id | Get a specific user by ID |
| PATCH  | /users/:id | Update user information   |
| DELETE | /users/:id | Delete user by ID         |

## Notes

Password hashing: User passwords are stored securely using bcrypt.

JWT Authentication: Use the token from /auth/login in the Authorization header with Bearer <token>.

Validation: DTOs enforce required fields, optional fields, and custom validation messages.
