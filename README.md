# Shopping Cart App

## Project Title
Shopping Cart App – Single Page E-Commerce Cart Website

## Project Overview
This project is a single-page web application built for Assignment 1. It simulates a simple e-commerce shopping cart system where users can browse products, add items to a cart, update quantities, and remove items from the cart. The application focuses on smooth interaction, dynamic page updates, and full CRUD operations connected to a MySQL database.

## Problem Statement
Online shopping websites need a clear and efficient cart system so that users can manage selected products without confusion. This project solves that problem by providing a lightweight shopping cart application that allows users to view products and manage their cart on one main page without reloading the browser. It demonstrates how frontend and backend technologies can work together with a database to support practical business logic.

## Technical Stack

### Stack Summary
- **Frontend:** React + Vite
- **Styling:** CSS
- **Routing / UI Pattern:** Single Page Application (SPA)
- **Backend:** FastAPI
- **Database:** MySQL
- **ORM / Data Access:** SQLModel
- **API Communication:** Fetch API
- **Development Environment:** Local development
- **Deployment:** Not deployed, tested locally

### Technical Stack Diagram
```text
React + Vite (Frontend UI)
        ↓
     Fetch API
        ↓
   FastAPI Backend
        ↓
   SQLModel / CRUD
        ↓
      MySQL
```

## Main Features
- View all available products on the page
- Add products to the shopping cart
- Update the quantity of cart items
- Remove items from the shopping cart
- Display the total cart price dynamically
- Show loading and error states
- Responsive layout for different screen sizes
- Single-page application behaviour without full page reloads

## CRUD Coverage
- **Create:** Add a product to the cart
- **Read:** Display all products and current cart items
- **Update:** Change the quantity of a cart item
- **Delete:** Remove a cart item from the cart

## Folder Structure
```text
zechenzhu-26038947-assignment1/
├── backend/
│   ├── main.py
│   ├── crud.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
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
│       ├── assets/
│       └── services/
│           └── api.js
└── README.md
```

## Folder Explanation
- **frontend/** contains the React user interface and client-side logic.
- **backend/** contains the FastAPI server, database models, and CRUD operations.
- **database/** contains the MySQL export file used to create or restore the database.
- **README.md** explains the purpose, structure, and setup of the project.

## Challenges Faced
One challenge was connecting the React frontend to the FastAPI backend and making sure data could be exchanged correctly through REST APIs. Another challenge was keeping the cart interface updated instantly after create, update, and delete actions without reloading the page. I also needed to configure CORS properly so the frontend and backend could communicate during local development. Managing cart quantities and keeping the database data consistent with the frontend state required repeated testing. Finally, I adjusted the layout and styling to make the application clearer and more usable on different screen sizes.

## How to Run the Project

### 1. Set up the database
Create a MySQL database and import the SQL file.

- Database file: `database/shopping_cart.sql`

You can import it using MySQL Workbench or the MySQL command line.

### 2. Run the backend
Open the `backend` folder and install dependencies:

```bash
pip install -r requirements.txt
```

Then start the FastAPI server:

```bash
uvicorn main:app --reload
```

### 3. Run the frontend
Open the `frontend` folder and install dependencies:

```bash
npm install
```

Then start the React development server:

```bash
npm run dev
```

### 4. Open the application
After both servers are running, open the local frontend URL shown by Vite in your browser.

## Notes
- This project was tested in a local development environment.
- The application is designed to behave like a single-page application.
- The main business logic is focused on shopping cart management with full CRUD support.

## Author
Zechen Zhu  
UTS Assignment 1