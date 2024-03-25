const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getAllTransactions);
router.get("/expenses/sum", transactionController.getSumOfExpenses);
router.get("/revenue/sum", transactionController.getSumOfRevenue);
router.post("/add", transactionController.createTransaction);
router.put("/:id", transactionController.modifyTransaction);
router.delete("/:id", transactionController.deleteTransaction);
module.exports = router;
