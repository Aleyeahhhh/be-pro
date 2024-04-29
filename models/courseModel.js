const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  numberOfLessons: { type: Number, required: true },
  className: { type: String, required: true },
  numberOfAttendants: { type: Number, default: 0 },
});

module.exports = mongoose.model("Course", courseSchema);
