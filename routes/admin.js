const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const employeeController = require("../controllers/employeeController");
router.get("/", (req, res) => {
  res.send("admin path");
});
router.get("/coursetitles", adminController.listCourseTitles);
router.get("/allcourses", adminController.listCourses);
router.get("/allemployees", adminController.getAllEmployees);
router.get("/employeebyid/:id", adminController.getEmployeeById);
// router.post("/account", adminController.createAdminAccount);
router.post("/createemployee", adminController.createEmployee);
router.post("/createcourse", adminController.createCourse);
router.put("/employeeupdate/:id", adminController.updateEmployee);
router.put("/coursemodify/:id", adminController.modifyCourse);
router.delete("/coursedelete/:id", adminController.deleteCourse);
router.delete("/employeedelete/:id", adminController.deleteEmployee);
module.exports = router;
