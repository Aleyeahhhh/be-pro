const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

async function createAdminAccount() {
  try {
    const admin = await Admin.findOne();

    if (!admin) {
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Check if admin credentials are provided
      if (!adminUsername || !adminPassword) {
        console.error("Admin username or password not provided.");
        return;
      }
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.create({
        username: adminUsername,
        password: hashedPassword,
      });
      console.log("Admin account created successfully.");
    } else {
      console.log("Admin account already exists.");
    }
  } catch (error) {
    console.error("Error creating admin account:", error);
  }
}

createAdminAccount();
module.exports = {
  createAdminAccount,
};
