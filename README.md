# 📚 BookReservationSystem

A simple, full-stack web application designed to manage a book catalog, process book rentals, and handle user wallets. The project features a modern, Single Page Application (SPA) front-end and a secure back-end system integrated with an in-memory database.

---

## ✨ Features

### 🔐 Authentication & User Management
* **Registration:** Create a new user account (First Name, Last Name, Email) with a default initial wallet balance and automatic login upon sign-up.
* **Login:** Access the library dashboard using a registered email address.
* **Session Management:** Persistent user sessions stored in the browser's `localStorage`, complete with a secure logout function.

### 💳 Built-in Wallet & Payment System
* **Live Balance Tracking:** Display current wallet balance directly in the navigation bar.
* **Top-Up (Deposit):** Instant account recharge capability via an integrated popover form.
* **Automated Price Calculation:** Dynamic cart total computation with instant balance check upon checkout.
* **Funds Guard:** Rejects transaction requests if the wallet balance is insufficient to complete the rental.

### 📖 Book Catalog & Shopping Cart
* **Live Catalog:** Browse the complete list of books available in the database with clear price listings.
* **Dynamic Cart:** Add and remove books to/from the cart seamlessly without reloading the page (SPA).
* **Validation Guards:** Prevents duplicate book additions and disables checkout when the cart is empty or funds are missing.

### ⏱️ Book Rentals
* **One-Click Checkout:** Rent selected books from the cart with automatic wallet deduction.
* **Automated Deadlines:** Calculates rental dates and sets return due dates (14-day duration).
* **User History:** Dedicated "Rented" view displaying active book rentals for the current profile.

---

## 🛠️ Technology Stack

### Back-end (Server)
* **Java 17** (or newer)
* **Spring Boot** (Spring Web, Spring Data JPA)
* **H2 Database** (In-Memory database, ideal for development, testing, and quick setup)
* **Maven** (Dependency management and build tool)

### Front-end (User Interface)
* **HTML5** (Semantic structure with custom dialog components)
* **CSS3** (Responsive design built with CSS Grid/Flexbox and popovers)
* **JavaScript (Vanilla JS)** (Asynchronous API handling via `fetch`, state persistence, and dynamic DOM manipulation)

---

## 🚀 Getting Started

### 1. Running the Back-end (Spring Boot)
1. Open the back-end project folder in **IntelliJ IDEA** (or your preferred IDE).
2. Allow Maven to download all necessary dependencies from the `pom.xml` file.
3. Locate the main application class (e.g., `LibraryApplication.java`) and click **Run**.
4. By default, the server will start at: `http://localhost:8080`.

### 2. Running the Front-end
1. Open the folder containing the front-end files.
2. Open `index.html` directly in any web browser (or use the *Live Server* extension in VS Code / IntelliJ).

---

## 🔌 Main REST API Endpoints

The front-end and back-end communicate strictly via JSON format:

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new user account (with default wallet balance) |
| `POST` | `/api/auth/login` | Logs in a user using their email address |
| `GET` | `/api/books` | Retrieves a list of all available books in the catalog |
| `POST` | `/api/rentals/deposit` | Tops up the user's wallet balance |
| `POST` | `/api/rentals/borrow` | Deducts funds and rents out selected books from the cart |
| `GET` | `/api/rentals/user/{id}` | Fetches active rentals for a specific user ID |

---

## 📝 Important Database Notes
This application uses an **In-Memory H2 Database**:
* Every time you restart the Spring Boot server, **the database is wiped clean and re-initialized**.
* Newly registered accounts, updated wallet balances, and recent rentals persist only while the backend is actively running.