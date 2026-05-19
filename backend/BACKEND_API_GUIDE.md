# Backend API Guide for Frontend Member

Backend base URL:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

## Test accounts

```text
Admin:
email: admin@example.com
password: admin123

Normal user:
email: user@example.com
password: user123
```

## Run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

If the old database schema already exists, import the updated SQL file first:

```text
database/shopping_cart.sql
```

This is important because the new cart table has `user_id`.

## Authentication flow

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "username": "Tom",
  "email": "tom@example.com",
  "password": "tom12345"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "user123"
}
```

Response:

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 2,
    "username": "Demo User",
    "email": "user@example.com",
    "role": "user"
  }
}
```

Frontend must store `access_token`, then send it in later protected requests:

```http
Authorization: Bearer jwt_token_here
```

## Product APIs

### Get all products

```http
GET /products
```

### Real-time product search

Either of these works:

```http
GET /products?search=mouse
GET /products/search?keyword=mouse
```

### Create product, admin only

```http
POST /products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Webcam",
  "description": "HD webcam for online meetings",
  "price": 59.99,
  "image_url": "https://via.placeholder.com/300x200",
  "stock": 10
}
```

### Update product, admin only

```http
PUT /products/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "price": 24.99,
  "stock": 18
}
```

### Delete product, admin only

```http
DELETE /products/1
Authorization: Bearer ADMIN_TOKEN
```

## Cart APIs, logged-in user only

### Get my cart

```http
GET /cart
Authorization: Bearer USER_TOKEN
```

### Add product to my cart

```http
POST /cart/add
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 1
}
```

Compatibility endpoint for old query style:

```http
POST /cart/add-query?product_id=1&quantity=1
Authorization: Bearer USER_TOKEN
```

### Update cart item quantity

```http
PUT /cart/1
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "quantity": 3
}
```

Compatibility endpoint for old query style:

```http
PUT /cart/update?cart_item_id=1&quantity=3
Authorization: Bearer USER_TOKEN
```

### Delete cart item

```http
DELETE /cart/1
Authorization: Bearer USER_TOKEN
```

Compatibility endpoint for old query style:

```http
DELETE /cart/delete?cart_item_id=1
Authorization: Bearer USER_TOKEN
```

## Admin APIs

### Get all users

```http
GET /admin/users
Authorization: Bearer ADMIN_TOKEN
```

### Get all users' carts

```http
GET /admin/carts
Authorization: Bearer ADMIN_TOKEN
```

### Get one user's cart

```http
GET /admin/users/2/cart
Authorization: Bearer ADMIN_TOKEN
```
