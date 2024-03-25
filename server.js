const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/db");
const jwt = require("jsonwebtoken");
const indexRoute = require("./routes/index");
const usersRoute = require("./routes/users");
const adminsRoute = require("./routes/admin");
const transactionsRoute = require("./routes/transactions");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Database connection
db()
  .then(() => {
    console.log("Connected to the database");

    // Routes
    app.use("/", indexRoute);
    app.use("/users", usersRoute);
    app.use("/admin", adminsRoute);
    app.use("/transactions", transactionsRoute);
    // Start server
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });
