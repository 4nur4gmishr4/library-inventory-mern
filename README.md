# Library Inventory Management System

## Project description and features

A full-stack Library Inventory Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows librarians to manage books and members through a secure, JWT-authenticated interface.

- **Authentication:** Librarian registration and login with JWT-based authentication
- **Book Management:** Full CRUD for books — add, view, edit, and delete with fields for Title, Author, ISBN, Genre, and Total Copies
- **Member Management:** Full CRUD for members — add, view, edit, and delete with fields for Full Name, Email, Phone Number, and Membership Type
- **Protected Routes:** All CRUD operations require authentication; unauthenticated users are redirected to the login page
- **Validation:** Client-side and server-side validation for all forms with matching rules
- **Security:** Helmet, CORS, rate limiting, bcrypt password hashing, JWT authentication
- **Centralized Error Handling:** Backend middleware for consistent error responses

## Tech stack used

- **Frontend:** React.js 19 (with Hooks), React Router DOM, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Security:** Helmet, express-rate-limit, CORS
- **Build Tool:** Vite

## Step-by-step local setup instructions

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
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/library
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Install and Run

Run the following command in the root folder to install all dependencies and start both servers:

```bash
npm run setup
```

The backend will start on `http://localhost:5000` and the frontend will automatically open at `http://localhost:5173`. Register a new account, then log in to start managing books and members.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://\<user\>:\<password\>@cluster.mongodb.net/library |
| JWT_SECRET | Secret key for JWT signing | your_secret_key_here |
| JWT_EXPIRES_IN | JWT token expiry duration | 7d |

## API Endpoints documentation

### Authentication

| Method | Route | Description | Auth needed | Request Body | Response |
|---|---|---|---|---|---|
| POST | /api/auth/register | Register a new librarian | No | `{ name, email, password }` | `{ _id, name, email, role, token }` |
| POST | /api/auth/login | Login and get JWT token | No | `{ email, password }` | `{ _id, name, email, role, token }` |

### Books

| Method | Route | Description | Auth needed | Request Body | Response |
|---|---|---|---|---|---|
| GET | /api/books | Get all books | Yes | — | `[{ _id, title, author, isbn, genre, totalCopies }]` |
| POST | /api/books | Add a new book | Yes | `{ title, author, isbn, genre, totalCopies }` | `{ _id, title, author, isbn, genre, totalCopies }` |
| PUT | /api/books/:id | Update a book | Yes | `{ title, author, isbn, genre, totalCopies }` | `{ _id, title, author, isbn, genre, totalCopies }` |
| DELETE | /api/books/:id | Delete a book | Yes | — | `{ message: "Book removed" }` |

### Members

| Method | Route | Description | Auth needed | Request Body | Response |
|---|---|---|---|---|---|
| GET | /api/members | Get all members | Yes | — | `[{ _id, fullName, memberId, email, phone, membershipType }]` |
| POST | /api/members | Add a new member | Yes | `{ fullName, email, phone, membershipType }` | `{ _id, fullName, memberId, email, phone, membershipType }` |
| PUT | /api/members/:id | Update a member | Yes | `{ fullName, email, phone, membershipType }` | `{ _id, fullName, memberId, email, phone, membershipType }` |
| DELETE | /api/members/:id | Delete a member | Yes | — | `{ message: "Member removed" }` |

## Folder structure overview

```
library-inventory-mern/
├── .gitignore
├── README.md
├── package.json
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── DataContext.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Books.jsx
│       │   └── Members.jsx
│       ├── assets/
│       │   └── logo.png
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── server/
    ├── .env.example
    ├── package.json
    ├── server.js
    ├── app.js
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