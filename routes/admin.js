const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", (req, res) => {
  res.send("admin path");
});

router.post("/admin", adminController.createAdminAccount);

module.exports = router;
