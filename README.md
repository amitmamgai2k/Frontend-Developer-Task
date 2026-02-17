# Frontend Developer Intern Assignment

This is a full-stack web application built with React (Frontend) and Node.js/Express (Backend), featuring Authentication, Dashboard, and CRUD operations.

## Features

- **Authentication**: JWT-based Signup and Login.
- **Dashboard**:
  - View, Create, Edit, and Delete Tasks (Todos).
  - Search and Filter Tasks by status.
  - User Profile management (Edit Name, Bio, Password).
- **Security**: Password hashing (bcrypt) and Protected Routes.
- **UI/UX**: Responsive design using TailwindCSS, Toast notifications, and Loading states.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router DOM, React Hook Form, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, BcryptJS.

## Prerequisites

- Node.js installed.
- MongoDB installed locally or a MongoDB Atlas connection string.

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the `Backend` folder:
    ```bash
    cd Backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory (if not exists) and add your configuration:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/frontend_intern_assignment
    JWT_SECRET=your_secret_key
    ```
    *Note: Replace `MONGO_URI` with your actual MongoDB connection string.*
4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the `Frontend` folder:
    ```bash
    cd Frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1.  Open your browser and navigate to the Frontend URL (usually `http://localhost:5173`).
2.  Sign up for a new account.
3.  You will be redirected to the Dashboard.
4.  Create tasks, filter them, or update your profile via the User Icon.
