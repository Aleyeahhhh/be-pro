const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const redisClient = require("../config/redisConfig");

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

exports.createUser = async (req, res) => {
  try {
    const { name, lastname, email, address, dob, number, password } = req.body;
    // Check if an email already exists in the database
    const emailLowerCase = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLowerCase });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already used. Please use a different email address.",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with all validated and processed fields
    const newUser = new User({
      name,
      lastname,
      email: emailLowerCase,
      address,
      dob,
      number,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with the user object without password
    const userToReturn = { ...savedUser._doc, password: undefined };
    res.status(201).json(userToReturn);
  } catch (error) {
    console.error(error); // Log the full error message
    if (error.name === "MongoError" && error.code === 11000) {
      res.status(409).json({
        message: "Duplicate email. Please use a different email address.",
      });
    } else {
      res.status(500).json({ message: "Error occurred", error: error.message });
    }
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, email, address, dob, number, avatar } = req.body;
    // Validate the number field
    if (number && !/^\d{8}$/.test(number)) {
      return res
        .status(400)
        .json({ error: "Number must exactly have 8 digits" });
    }
    // Validate the date of birth field to ensure the user is at least 14 years old
    if (dob) {
      const userDob = new Date(dob);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 14,
        today.getMonth(),
        today.getDate()
      );
      if (userDob > minAgeDate) {
        return res
          .status(400)
          .json({ error: "User must be at least 14 years old" });
      }
    }
    // Check if the email is being updated to a new one that might already exist in the database
    if (email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({
          error: "Email already used. Please use a different email address.",
        });
      }
    }

    // Prepare the update object with the fields to be updated
    const updateObject = { name, lastname, email, address, dob, number };

    // If avatar is provided in the request body, add it to the update object
    if (avatar) {
      updateObject.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an existing user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Gmail Login
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleLoginCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // Generate token for user
    const token = generateTokenForUser(user);
    res.status(200).json({ message: "Login successful", token });
  })(req, res, next);
};

//Facebook Login
exports.facebookLogin = passport.authenticate("facebook");

exports.facebookLoginCallback = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    // Here, you could generate a token as in the original login method
    // Assuming you have a method to generate a token for a user
    const token = generateTokenForUser(user);
    res.status(200).json({ message: "Login successful", token });
  })(req, res, next);
};
// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      dob: user.dob,
      number: user.number,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.countEnseignants = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "Enseignant" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.countEtudiant = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: "Utilisateur" });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.logout = (req, res) => {
  // Assuming the token is stored in a header or cookie
  const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

  // Add the token to a blacklist
  tokenBlacklist.add(token);

  res.clearCookie("token"); // Clear the token cookie if set
  return res.status(200).json({ message: "Logout successful" });
};

//PAYMENT
// exports.processPayment = async (req, res) => {
//   try {
//     const { amount, source } = req.body; // 'source' is the Stripe token

//     // Create a charge: this will charge the user's card
//     const charge = await stripe.charges.create({
//       amount: amount, // Charge amount in cents
//       currency: "usd",
//       source: source,
//       description: "E-learning course payment",
//     });

//     // If the charge is successful
//     res.status(200).json({ message: "Payment successful", charge });
//   } catch (error) {
//     // Handle errors: card declines, network issues, etc.
//     res.status(500).json({ error: error.message });
//   }
// };
