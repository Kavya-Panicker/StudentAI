
const express = require("express");

const {
  getMyAttendance,
  markAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch attendance history for the authenticated student.
router.get("/me", protect, getMyAttendance);

// Mark attendance after trusted server-side face verification.
router.post("/mark", protect, markAttendance);

module.exports = router;
