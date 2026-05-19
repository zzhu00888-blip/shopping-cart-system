CREATE DATABASE IF NOT EXISTS shopping_cart;
USE shopping_cart;

-- Recreate tables for Assignment 2 backend.
-- This version adds users, password hashes, JWT-based login support,
-- user-owned cart items, product CRUD, and admin cart viewing.

DROP TABLE IF EXISTS cartitem;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS app_user;

CREATE TABLE app_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price FLOAT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE cartitem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    INDEX idx_cart_user_id (user_id),
    INDEX idx_cart_product_id (product_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Demo accounts
-- Admin login: admin@example.com / admin123
-- User login: user@example.com / user123
INSERT INTO app_user (username, email, hashed_password, role) VALUES
('Admin', 'admin@example.com', 'pbkdf2_sha256$120000$e504c69b0ef963e113b84ddb7035a8b3$8d3d85e3722ffed359cec5ed5ee22bb80ab70e37640b7197c2944e2c226514fd', 'admin'),
('Demo User', 'user@example.com', 'pbkdf2_sha256$120000$dec0680018d0fc65916e2534a0daae1d$e3c85eb5e5216cdd1a8ce5e119190cf896de3aca4bafe8dbdb156931e9c221bf', 'user');

INSERT INTO product (name, description, price, image_url, stock) VALUES
('Wireless Mouse', 'Comfortable wireless mouse for daily use', 29.99, 'https://via.placeholder.com/300x200', 20),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 89.99, 'https://via.placeholder.com/300x200', 15),
('USB-C Hub', 'Multi-port USB-C hub for laptops and tablets', 45.50, 'https://via.placeholder.com/300x200', 30),
('Gaming Headset', 'Over-ear gaming headset with noise-cancelling mic', 79.00, 'https://via.placeholder.com/300x200', 12),
('Laptop Stand', 'Adjustable aluminium laptop stand', 39.90, 'https://via.placeholder.com/300x200', 25);

INSERT INTO cartitem (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 3, 2);
