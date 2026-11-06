
const Student = require("../models/Student");
const University = require("../models/University");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new student
const createStudent = async (req, res) => {
  try {
    const {
      universityId,
      fullName,
      email,
      password,
      studentId,
      department,
      semester,
    } = req.body;

    // Check required fields
    if (
      !universityId ||
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password ||
      typeof studentId !== "string" ||
      !studentId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "University ID, full name, email, password and student ID are required",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    // Check whether the university exists
    const university = await University.findById(universityId);

    if (!university || !university.isActive) {
      return res.status(404).json({
        success: false,
        message: "Active university not found",
      });
    }

    // Normalize input
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId.trim();

    // Check for duplicate student email or ID
    const existingStudent = await Student.findOne({
      universityId,
      $or: [
        { email: normalizedEmail },
        { studentId: normalizedStudentId },
      ],
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student email or student ID already exists",
      });
    }

    // Hash password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    const student = await Student.create({
      universityId,
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      studentId: normalizedStudentId,
      department,
      semester,
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        universityId: student.universityId,
        department: student.department,
        semester: student.semester,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Student email or student ID already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid university ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register student",
    });
  }
};

// Student login
const loginStudent = async (req, res) => {
  try {
    const { universityId, email, password } = req.body;

    // Check required fields
    if (
      !universityId ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "University ID, email and password are required",
      });
    }

    // Find student and include the password hash
    const student = await Student.findOne({
      universityId,
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");

    // Do not reveal whether an account exists
    if (!student || !student.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const passwordMatches = await bcrypt.compare(
      password,
      student.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables");

      return res.status(500).json({
        success: false,
        message: "Login is temporarily unavailable",
      });
    }

    // Generate a JWT token valid for one hour
    const token = jwt.sign(
      {
        studentId: student._id.toString(),
        universityId: student.universityId.toString(),
        role: "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        universityId: student.universityId,
        department: student.department,
        semester: student.semester,
      },
    });
  } catch (error) {
    console.error("Student login error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid university ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Student login failed",
    });
  }
};

// Get the logged-in student's profile
const getMyProfile = async (req, res) => {
  try {
    // These values come from the verified JWT token
    const student = await Student.findOne({
      _id: req.user.studentId,
      universityId: req.user.universityId,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        studentId: student.studentId,
        universityId: student.universityId,
        department: student.department,
        semester: student.semester,
      },
    });
  } catch (error) {
    console.error("Fetch student profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student profile",
    });
  }
};

// Export all student controller functions
module.exports = {
  createStudent,
  loginStudent,
  getMyProfile,
};
