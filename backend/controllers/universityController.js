
const University = require("../models/University");

// Register a new university
const createUniversity = async (req, res) => {
  try {
    const { name, code, email, address } = req.body;

    if (!name || !code || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, code and email are required",
      });
    }

    const existingUniversity = await University.findOne({
      $or: [
        { code: code.trim().toUpperCase() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existingUniversity) {
      return res.status(409).json({
        success: false,
        message: "University code or email already exists",
      });
    }

    const university = await University.create({
      name,
      code,
      email,
      address,
    });

    return res.status(201).json({
      success: true,
      message: "University registered successfully",
      data: university,
    });
  } catch (error) {
    console.error("University registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "University code or email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register university",
    });
  }
};

// Get all universities
const getUniversities = async (req, res) => {
  try {
    const universities = await University.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    console.error("Fetch universities error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch universities",
    });
  }
};

module.exports = {
  createUniversity,
  getUniversities,
};
