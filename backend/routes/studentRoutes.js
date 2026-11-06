
const express = require("express");

const {
  createStudent,
  loginStudent,
  getMyProfile,
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register a student
router.post("/", createStudent);

// Student login
router.post("/login", loginStudent);

// Get the logged-in student's profile
router.get("/me", protect, getMyProfile);

module.exports = router;
