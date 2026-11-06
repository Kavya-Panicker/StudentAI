
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const University = require("../models/University");

// Get the current date's midnight in Indian Standard Time.
const getTodayInIndia = () => {
  const dateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return new Date(`${dateString}T00:00:00+05:30`);
};

// Get attendance history for the logged-in student.
const getMyAttendance = async (req, res) => {
  try {
    const { studentId, universityId } = req.user;

    const records = await Attendance.find({
      studentId,
      universityId,
    })
      .sort({ attendanceDate: -1 })
      .select("-__v");

    return res.status(200).json({
      success: true,
      message: "Attendance history fetched successfully",
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Fetch attendance error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance history",
    });
  }
};

// Mark attendance only after trusted server-side face verification.
const markAttendance = async (req, res) => {
  try {
    const { studentId, universityId } = req.user;

    // This value must be set by trusted server-side verification,
    // never accepted directly from the request body.
    const verification = req.faceVerification;

    if (!verification || verification.verified !== true) {
      return res.status(403).json({
        success: false,
        message: "Face verification is required before marking attendance",
      });
    }

    const student = await Student.findOne({
      _id: studentId,
      universityId,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Active student not found",
      });
    }

    const university = await University.findOne({
      _id: universityId,
      isActive: true,
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "Active university not found",
      });
    }

    const attendanceDate = getTodayInIndia();

    const record = await Attendance.create({
      studentId: student._id,
      universityId: university._id,
      attendanceDate,
      status: "Present",
      method: "face-recognition",
      faceMatchConfidence:
        typeof verification.confidence === "number"
          ? verification.confidence
          : null,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: record,
    });
  } catch (error) {
    console.error("Mark attendance error:", error.message);

    // The unique database index prevents duplicate daily attendance.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Attendance has already been marked for today",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
};

module.exports = {
  getMyAttendance,
  markAttendance,
};
