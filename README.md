# Bill Manager

A robust full-stack web application built with **Node.js, Express, and MongoDB** to track and manage your daily/monthly bills easily.

## Features
- **User Authentication:** Secure Sign Up and Login system (using JWT).
- **Dashboard:** View all your tracked bills and total spending in one place.
- **Add Bills:** Simple interface to log new expenses.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend Template Engine:** EJS
- **Authentication:** JSON Web Tokens (JWT), Cookie Parser

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-address>
   cd bill_manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**
   You can set the `PORT` and `MONGO_URI` in an `.env` file or export them locally. 
   By default, the app uses `PORT=8000` and a local MongoDB connection string.

4. **Start the application**
   ```bash
   # Development mode (uses nodemon)
   npm start
   
   # Or standard node run
   node index.js
   ```

5. **Visit the App**
   Open `http://localhost:8000` in your browser.
