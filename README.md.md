# Assignment 2 Backend Update Summary

This backend extends the original Assignment 1 shopping cart project into a more complete full-stack e-commerce system.

## Added features

- User registration and login
- Password hashing using PBKDF2-SHA256
- JWT-style token authentication
- User roles: `user` and `admin`
- Product CRUD for admin users
- Real-time product search API
- User-owned shopping cart CRUD
- Admin APIs to view all users and all user carts
- Updated SQL database export
- API guide for the frontend member

## Important note

The old Assignment 1 cart table did not have `user_id`. The new backend needs the updated SQL schema in:

```text
database/shopping_cart.sql
```

Before testing the new backend, import this SQL file or recreate the database.

## Demo accounts

```text
Admin: admin@example.com / admin123
User: user@example.com / user123
```

## Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs:

```text
http://127.0.0.1:8000/docs
```
## Team Contributions

### Zechen Zhu - Backend Developer

I was mainly responsible for the backend development of this project. I built the FastAPI backend, connected it to the MySQL database, and implemented the main API functions required by the system.

My work included user registration and login, password hashing, JWT authentication, user and admin role control, product CRUD operations, shopping cart CRUD operations, and admin APIs for viewing all users and shopping cart records. I also prepared the SQL database export file and backend API documentation for frontend integration.