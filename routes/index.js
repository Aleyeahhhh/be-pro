const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
// const  = require("../middleware/emailMiddleware");
router.get("/", (req, res) => {
  res.send("Welcome to my application!");
});
router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/auth/facebook", userController.facebookLogin);
router.get("/auth/facebook/callback", userController.facebookLoginCallback);
router.get("/auth/google", userController.googleLogin);
router.get("/auth/google/callback", userController.googleLoginCallback);
router.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route");
});
module.exports = router;
