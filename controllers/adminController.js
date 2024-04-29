const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const Course = require("../models/courseModel");
const Employee = require("../models/employeeModel");
// async function createAdminAccount() {
//   try {
//     const admin = await Admin.findOne();

//     if (!admin) {
//       const adminUsername = process.env.ADMIN_USERNAME;
//       const adminPassword = process.env.ADMIN_PASSWORD;

//       // Check if admin credentials are provided
//       if (!adminUsername || !adminPassword) {
//         console.error("Admin username or password not provided.");
//         return;
//       }
//       const hashedPassword = await bcrypt.hash(adminPassword, 10);
//       await Admin.create({
//         username: adminUsername,
//         password: hashedPassword,
//       });
//       console.log("Admin account created successfully.");
//     } else {
//       console.log("Admin account already exists.");
//     }
//   } catch (error) {
//     console.error("Error creating admin account:", error);
//   }
// }

// createAdminAccount();
// module.exports = {
//   createAdminAccount,
// };
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      category,
      prerequisites,
      startDate,
      endDate,
      price,
      numberOfLessons,
      className,
      numberOfAttendants, // Assume this starts at 0 and is updated elsewhere.
    } = req.body;

    // Create a new course instance with all provided data
    const course = new Course({
      title,
      description,
      instructor,
      category,
      prerequisites,
      startDate,
      endDate,
      price,
      numberOfLessons,
      className,
      numberOfAttendants,
    });

    // Save the course to the database
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Failed to create course:", error);
    const response = {
      message: "Failed to create course",
      error: error.message,
    };

    // Check the type of validation error
    if (error.name === "ValidationError") {
      res.status(400).json(response);
    } else {
      res.status(500).json(response);
    }
  }
};
exports.listCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error("Failed to list courses:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.modifyCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Failed to modify course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.listCourseTitles = async (req, res) => {
  try {
    const courses = await Course.find().select("title");
    const titles = courses.map((course) => course.title);
    res.json(titles);
  } catch (error) {
    console.error("Failed to retrieve course titles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Failed to delete course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      avatar,
      profession,
      salary,
      inscriptionDate,
      address,
      email,
      number,
    } = req.body;

    const employee = new Employee({
      name,
      avatar,
      profession,
      salary,
      inscriptionDate,
      address,
      email,
      number,
    });

    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      avatar,
      profession,
      salary,
      inscriptionDate,
      address,
      email,
      number,
    } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        avatar,
        profession,
        salary,
        inscriptionDate,
        address,
        email,
        number,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
