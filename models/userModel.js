const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  number: { type: Number, required: true },
  role: {
    type: String,
    enum: ["Utilisateur", "Enseignant"],
    default: "Utilisateur",
  },
  password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
