# Admin Dashboard - Backend API

This directory contains the Node.js, Express, and MongoDB backend API for the Admin Dashboard application. It handles user authentication, CRUD operations for users, image uploads (stored locally for this version), and serves dashboard statistics.

## Features

*   Admin JWT Authentication (`/api/auth/login`)
*   User Management CRUD Endpoints (`/api/users`)
    *   GET `/`: Retrieve all users
    *   POST `/`: Create a new user (expects `multipart/form-data` including profile picture)
    *   GET `/:id`: Retrieve a single user
    *   PUT `/:id`: Update a user (expects `multipart/form-data` if picture changes)
    *   DELETE `/:id`: Delete a user
*   Dashboard Statistics Endpoint (`/api/stats`)
*   Local Image Upload Handling using `multer` (saved to `./uploads/`)
*   Static file serving for uploaded images (`/uploads/`)

## Tech Stack

*   Node.js
*   Express.js
*   MongoDB (using Mongoose ODM)
*   `jsonwebtoken` (JWT Authentication)
*   `bcryptjs` (Password Hashing)
*   `multer` (File Upload Handling)
*   `cors` (Cross-Origin Resource Sharing)
*   `dotenv` (Environment Variable Management)

## Prerequisites

*   [Node.js](https://nodejs.org/) (v16.x or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally or a MongoDB Atlas connection string.

## Setup & Installation (Local)

1.  **Navigate to the backend directory:**
    ```bash
    cd admin-dashboard-apis
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Create `.env` file:**
    Create a file named `.env` in this `backend` directory and add the following variables:
    ```dotenv
    MONGO_URI=mongodb://localhost:27017/admin_dashboard  # Or your Atlas connection string
    JWT_SECRET=YOUR_REALLY_STRONG_SECRET_KEY           # Choose a strong secret
    PORT=5000                                         # Port for the backend server
    FRONTEND_URL=http://localhost:5173                # Your local frontend dev URL for CORS
    ```
    *(Note: The default admin credentials `admin@admin.com`/`admin123` are currently hardcoded in `controllers/authController.js` for demonstration purposes.)*

4.  **Ensure `uploads/` directory exists:** The `uploadMiddleware.js` attempts to create this, but manual creation might be needed depending on permissions (`mkdir uploads`).

## Running Locally

```bash
npm run dev   # If nodemon is configured in package.json scripts
# or
node server.js
