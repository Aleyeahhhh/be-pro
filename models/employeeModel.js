const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  profession: { type: String, required: true },
  salary: { type: Number, required: true },
  inscriptionDate: { type: Date, required: true },
  address: { type: String },

  email: { type: String, required: true },
  number: { type: Number },
});

module.exports = mongoose.model("Employee", employeeSchema);
