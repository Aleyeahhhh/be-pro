const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
router.get("/", (req, res) => {
  res.send("employee path");
});

module.exports = router;
