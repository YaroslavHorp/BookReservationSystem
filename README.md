# 📚 BookReservationSystem

A simple, full-stack web application designed to manage a book catalog and handle user rentals. The project features a modern, Single Page Application (SPA) front-end and a secure back-end system integrated with an in-memory database.

---

## ✨ Features

### 🔐 Authentication & User Management
* **Registration:** Create a new user account (First Name, Last Name, Email) with an automatic login upon successful sign-up.
* **Login:** Access the library dashboard using only a registered email address.
* **Session Management:** Persistent user sessions stored in the browser's `localStorage`, complete with a secure logout function.

### 📖 Book Catalog & Shopping Cart
* **Live Catalog:** Browse the complete list of books available in the database in real-time.
* **Dynamic Cart:** Add and remove books to/from the cart seamlessly without reloading the page (SPA).
* **Validation Guards:** Prevents users from adding the same book twice and disables checkout for empty carts.

### ⏱️ Book Rentals
* **One-Click Checkout:** Easily borrow a selection of books currently in the cart.
* **Automated Deadlines:** The system automatically logs the exact rental date and calculates the appropriate return due date.
* **User History:** A dedicated "Rented" dashboard view displaying all active rentals for the currently logged-in profile.

---

## 🛠️ Technology Stack

### Back-end (Server)
* **Java 17** (or newer)
* **Spring Boot** (Spring Web, Spring Data JPA)
* **H2 Database** (In-Memory database, ideal for development, testing, and quick setup)
* **Maven** (Dependency management and project building)

### Front-end (User Interface)
* **HTML5** (Semantic and clean document structure)
* **CSS3** (Fully responsive layout built with Flexbox and custom UI components)
* **JavaScript (Vanilla JS)** (Asynchronous API communication via `fetch`, global state management, and dynamic DOM rendering)

---

## 🚀 Getting Started

### 1. Running the Back-end (Spring Boot)
1. Open the back-end project folder in **IntelliJ IDEA** (or your preferred IDE).
2. Allow Maven to download all necessary dependencies from the `pom.xml` file.
3. Locate the main application class (e.g., `LibraryApplication.java`) and click **Run** (the green triangle button).
4. By default, the server will start and listen on: `http://localhost:8080`.

### 2. Running the Front-end
Since the client application is built using pure JavaScript, it does not require Node.js or any external package installation.
1. Open the folder containing the front-end files.
2. Double-click the `index.html` file to open the app directly in any web browser (or use the *Live Server* extension in VS Code / IntelliJ).

---

## 🔌 Main REST API Endpoints

The front-end and back-end communicate strictly via JSON formatting. The core controller endpoints are mapped as follows:

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new user account |
| `POST` | `/api/auth/login` | Logs in a user using their email address |
| `GET` | `/api/books` | Retrieves a list of all available books |
| `POST` | `/api/rentals/borrow` | Rents out the specific collection of books from the cart |
| `GET` | `/api/rentals/user/{id}` | Fetches active rentals for a specific user ID |

---

## 📝 Important Database Notes
This application uses an **In-Memory H2 Database**. Please keep in mind that:
* Every time you restart the application server in your IDE, **the database is completely wiped clean and recreated**.
* Newly registered accounts and recent book rentals will persist only as long as the Spring Boot server remains running.