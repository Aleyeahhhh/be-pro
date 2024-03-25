const express = require("express");
const router = express.Router();
const Transaction = require("../models/transactionModel");

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const currentDate = new Date();
    const newTransaction = new Transaction({
      date: currentDate,
      type,
      amount,
      description,
    });
    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.modifyTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        type,
        amount,
        description,
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSumOfExpenses = async (req, res) => {
  try {
    const expenseSum = await Transaction.aggregate([
      { $match: { type: "Expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    res
      .status(200)
      .json({ expenseSum: expenseSum[0] ? expenseSum[0].total : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSumOfRevenue = async (req, res) => {
  try {
    const revenueSum = await Transaction.aggregate([
      { $match: { type: "Revenue" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res
      .status(200)
      .json({ revenueSum: revenueSum[0] ? revenueSum[0].total : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
