# Library Inventory Management System

A full-stack Library Inventory Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows librarians to manage books and members through a secure, JWT-authenticated interface.

## Tech Stack

- **Frontend:** React.js (with Hooks), React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt

## Features

- **Authentication:** Librarian registration and login with JWT-based authentication
- **Book Management:** Add, view, edit, and delete books with fields for Title, Author, ISBN, Genre, and Total Copies
- **Member Management:** Add, view, edit, and delete members with fields for Full Name, Email, Phone Number, and Membership Type
- **Protected Routes:** All CRUD operations require authentication; unauthenticated users are redirected to the login page
- **Validation:** Client-side and server-side validation for all forms
- **Centralized Error Handling:** Backend middleware for consistent error responses

## Local Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or a MongoDB Atlas connection string)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/4nur4gmishr4/library-inventory-mern.git
cd library-inventory-mern
```

### 2. Configure Environment

Create a `.env` file in the `/server` directory (use `.env.example` as a reference):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/library-inventory
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
```

### 3. One-Command Setup & Run

We have configured a root orchestration script that will automatically install all dependencies for both the frontend and backend, start both servers concurrently, and open the application in your default browser.

Simply run the following command in the root folder (`library-inventory-mern`):

```bash
npm run setup
```

The backend will start on `http://localhost:5000` and the frontend will automatically open to `http://localhost:5173`. Register a new account, then log in to start managing books and members.

## Environment Variables

| Variable | Description | Sample Value |
|---|---|---|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/library-inventory |
| JWT_SECRET | Secret key for JWT signing | your_jwt_secret_here |
| JWT_EXPIRES_IN | JWT token expiry duration | 1d |

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| POST | /api/auth/register | Register a new librarian | No | `{ name, email, password }` | `{ _id, name, email, role, token }` |
| POST | /api/auth/login | Login and get JWT token | No | `{ email, password }` | `{ _id, name, email, role, token }` |

### Books

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| GET | /api/books | Get all books | Yes | — | `[{ _id, title, author, isbn, genre, totalCopies }]` |
| POST | /api/books | Add a new book | Yes | `{ title, author, isbn, genre, totalCopies }` | `{ _id, title, author, isbn, genre, totalCopies }` |
| PUT | /api/books/:id | Update a book | Yes | `{ title, author, isbn, genre, totalCopies }` | `{ _id, title, author, isbn, genre, totalCopies }` |
| DELETE | /api/books/:id | Delete a book | Yes | — | `{ message: "Book removed" }` |

### Members

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|---|---|---|---|---|---|
| GET | /api/members | Get all members | Yes | — | `[{ _id, fullName, memberId, email, phone, membershipType }]` |
| POST | /api/members | Add a new member | Yes | `{ fullName, email, phone, membershipType }` | `{ _id, fullName, memberId, email, phone, membershipType }` |
| PUT | /api/members/:id | Update a member | Yes | `{ fullName, email, phone, membershipType }` | `{ _id, fullName, memberId, email, phone, membershipType }` |
| DELETE | /api/members/:id | Delete a member | Yes | — | `{ message: "Member removed" }` |

## Validation Rules

| Field | Rules |
|---|---|
| Name / Title | Required, 2–100 characters |
| ISBN | Required, exactly 13 digits, unique |
| Email | Required, valid email format, unique |
| Phone Number | Exactly 10 digits, numeric only |
| Password | Min 8 characters, at least 1 uppercase, 1 number, 1 special character |

## Folder Structure

```
library-inventory-mern/
├── .gitignore
├── README.md
├── client/
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Books.jsx
│       │   └── Members.jsx
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── server/
    ├── .env.example
    ├── package.json
    ├── server.js
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── User.js
    │   ├── Book.js
    │   └── Member.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   └── memberRoutes.js
    ├── controllers/
    │   ├── authController.js
    │   ├── bookController.js
    │   └── memberController.js
    └── middleware/
        ├── authMiddleware.js
        └── errorMiddleware.js
```