const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");
router.get("/", (req, res) => {
  res.send("Welcome to my application!");
});
router.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route");
});
module.exports = router;
