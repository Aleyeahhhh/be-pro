const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const emailMiddleware = require("../middleware/emailMiddleware");

const moment = require("moment");

// const validateStrongPassword = function (password) {
//   // Regex to ensure password contains at least 8 characters, 1 number, 1 upper and 1 lowercase
//   return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
// };

const validateAge = function (value) {
  // Calculate age to be at least 14 years old
  const fourteenYearsAgo = moment().subtract(14, "years").toDate();
  return moment(value).isBefore(fourteenYearsAgo);
};

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
  dob: {
    type: Date,
    required: true,
    validate: [validateAge, "User must be at least 14 years old"],
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{8}$/.test(value);
      },
      message: "Number must exactly have 8 digits",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value);
      },
      message:
        "Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter",
    },
  },
  avatar: { type: String },
});

userSchema.pre("save", async function (next) {
  // Encrypt password before saving
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.pre("save", emailMiddleware);

module.exports = mongoose.model("User", userSchema);
