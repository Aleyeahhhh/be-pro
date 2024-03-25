const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const rbacMiddleware = require("../middleware/rbacMiddleware");
const verifyToken = require("../middleware/authMiddleware");

// Welcome page
router.get("/", verifyToken, (req, res) => {
  res.send("Page d'accueil");
});
router.get("/count-enseignants", userController.countEnseignants);
router.get("/count-etudiants", userController.countEtudiant);
router.get("/allusers", userController.getAllUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getUserProfile);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.put(
  "/:id/role",
  rbacMiddleware.checkPermission("updateUserRole"),
  userController.updateUserRole
);
router.delete("/:id", userController.deleteUser);

module.exports = router;
