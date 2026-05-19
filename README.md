# Shopping Cart System

## Project Title

Shopping Cart System – Full-Stack E-Commerce Web Application

## Project Overview

This project is a full-stack single-page e-commerce shopping cart system developed for Assignment 2. The application allows users to register, log in, browse products, search products in real time, add items to their shopping cart, update item quantities, and remove items from the cart.

The system also includes administrator functions. An administrator can manage product records, view all users, and view shopping cart records from all users. The project uses React for the frontend, FastAPI for the backend, and MySQL for database storage.

## Problem Statement

Online shopping platforms need a clear and efficient cart management system. Users should be able to browse products, search for items quickly, and manage their cart without unnecessary page reloads. At the same time, administrators need tools to manage products and monitor user shopping cart activity.

This project addresses these needs by providing a dynamic single-page web application with authentication, database CRUD operations, role-based access control, real-time product search, and shopping cart management.

## Technical Stack

### Frontend

- React
- Vite
- CSS
- Fetch API

### Backend

- FastAPI
- Python
- SQLModel
- PyMySQL
- JWT authentication
- Password hashing

### Database

- MySQL

### Development Environment

- Local development
- GitHub for version control

## System Architecture

```text
React + Vite Frontend
        ↓
     Fetch API
        ↓
   FastAPI Backend
        ↓
   SQLModel / CRUD
        ↓
      MySQL Database
```

## Main Features

### User Features

- User registration
- User login
- Password hashing for secure password storage
- JWT-based authentication
- View all available products
- Real-time product search
- Add products to shopping cart
- View personal shopping cart
- Update cart item quantity
- Delete cart items
- View shopping cart information dynamically

### Admin Features

- Admin login
- View all users
- View all users' shopping carts
- Create new products
- Read product list
- Update product information
- Delete products

## Database Entities

The project includes three main database entities.

### User

The User entity stores user account information.

Main fields:

- id
- username
- email
- hashed_password
- role

### Product

The Product entity stores product information.

Main fields:

- id
- name
- description
- price
- image_url
- stock

### CartItem

The CartItem entity stores shopping cart records linked to users and products.

Main fields:

- id
- user_id
- product_id
- quantity

## CRUD Coverage

### User

- Create: Register a new user
- Read: Get current user information and admin user list

### Product

- Create: Admin adds a new product
- Read: Display all products and search products
- Update: Admin updates product details
- Delete: Admin deletes products

### CartItem

- Create: User adds product to cart
- Read: User views shopping cart
- Update: User updates item quantity
- Delete: User removes item from cart

## Folder Structure

```text
shopping-cart-system/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── crud.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│   └── BACKEND_API_GUIDE.md
├── database/
│   └── shopping_cart.sql
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── eslint.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       └── services/
│           └── api.js
├── README.md
└── .gitignore
```

## How to Run the Project

### 1. Set up the database

Create a MySQL database and import the SQL file:

```text
database/shopping_cart.sql
```

The database can be imported using MySQL Workbench or the MySQL command line.

### 2. Configure backend database connection

Create a `.env` file inside the `backend` folder.

Example:

```env
DATABASE_URL=mysql+pymysql://root:your_password@127.0.0.1:3306/shopping_cart
SECRET_KEY=shopping-cart-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

The `.env` file should not be uploaded to GitHub.

### 3. Run the backend

Open the backend folder:

```bash
cd backend
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

Backend API documentation:

```text
http://127.0.0.1:8000/docs
```

Backend base URL:

```text
http://127.0.0.1:8000
```

### 4. Run the frontend

Open the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

## Test Accounts

### Admin Account

```text
email: admin@example.com
password: admin123
```

### User Account

```text
email: user@example.com
password: user123
```

## API Overview

Main backend APIs include:

```text
POST /auth/register
POST /auth/login
GET /auth/me

GET /products
GET /products/search?keyword=
POST /products
PUT /products/{product_id}
DELETE /products/{product_id}

GET /cart
POST /cart/add
PUT /cart/{cart_item_id}
DELETE /cart/{cart_item_id}

GET /admin/users
GET /admin/carts
```

Protected APIs require a JWT token in the request header:

```text
Authorization: Bearer <access_token>
```

## Team Contributions

### Zechen Zhu - Backend Developer and Database Integration

My main contribution was the backend development of the shopping cart system. I designed and implemented the FastAPI backend and connected it with the MySQL database.

My backend work includes:

- Designed and implemented the FastAPI backend structure.
- Created database models for User, Product, and CartItem.
- Implemented user registration and login functions.
- Added password hashing for secure password storage.
- Implemented JWT-based authentication.
- Added role-based access control for normal users and administrators.
- Developed product CRUD APIs.
- Developed shopping cart CRUD APIs linked to the logged-in user.
- Developed admin APIs for viewing all users and all shopping carts.
- Connected the backend to the MySQL database.
- Prepared the SQL database export file.
- Prepared backend API documentation for frontend integration.

### shengxuan sun - Frontend Developer

The frontend developer is responsible for implementing and updating the React frontend interface. This includes login and registration pages, product display, real-time product search, shopping cart interface, admin dashboard, and connecting the frontend pages with the backend APIs.

The frontend work includes:

- Building the login and registration interface.
- Storing the JWT token after successful login.
- Displaying the product list from the backend.
- Implementing real-time product search.
- Connecting add-to-cart, update-cart, and delete-cart functions to the backend APIs.
- Building the admin dashboard interface.
- Connecting admin pages to user, cart, and product management APIs.
- Improving the user interface and overall single-page application experience.

## Notes

- This project is developed as a single-page application.
- The backend uses JWT authentication for protected routes.
- Normal users can only manage their own shopping cart.
- Administrators can view all users and all shopping cart records.
- The `.env` file is ignored by Git and should not be uploaded to GitHub.
- The project is tested in a local development environment.

## Repository

GitHub Repository:

```text
https://github.com/zzhu00888-blip/shopping-cart-system
```