# Ōrtensia - Restaurant Website

A full-stack web application for a restaurant named Ōrtensia. This platform allows customers to seamlessly browse the menu, make table reservations, place delivery orders, and manage their personal accounts.

## 🚀 Features

* **User Authentication:** Secure sign-up and login functionality using Passport.js and Local Strategy.
* **Menu Browsing:** Beautifully designed menu showcasing the restaurant's offerings.
* **Table Reservations:** Authenticated users can easily book tables for their preferred dates and times.
* **Delivery Orders:** Integrated ordering system for food delivery.
* **Dynamic Views:** Server-side rendered pages using EJS for fast and dynamic content delivery.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript, EJS (Embedded JavaScript Templating)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ORM
* **Authentication & Security:** Passport.js, `passport-local-mongoose`, `express-session`, `connect-flash`

## 📁 Project Structure

```text
├── models/             # Mongoose database schemas (User, Reservation, Order)
├── public/             # Static assets (CSS, Images, Client-side JS)
│   ├── css/            # Stylesheets for different views
│   ├── img/            # Images used across the site
│   └── util/           # Client-side utility scripts
├── views/              # EJS template files
│   ├── partials/       # Reusable UI components (e.g., navbar)
│   └── ...             # EJS pages (home, menu, login, signup, etc.)
├── js/                 # Additional JavaScript logic (e.g., reservation handling)
├── server.js           # Main application entry point & Express configuration
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v14 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (installed locally or an Atlas cluster URI)

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ortensia-restaurant-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Database:**
   * Make sure your MongoDB server is running.
   * By default, the application connects to a local MongoDB instance. If you are using MongoDB Atlas or a custom URI, update the Mongoose connection string inside `server.js`.

4. **Run the application:**
   ```bash
   # Start the server normally
   node server.js
   
   # OR start with nodemon for development (auto-restarts on save)
   npx nodemon server.js
   ```

5. **View the app:**
   Open your browser and navigate to `http://localhost:3000` (or whichever port is specified in your `server.js`).
