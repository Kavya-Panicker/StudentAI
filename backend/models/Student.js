
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: "Computer Science and Engineering",
      trim: true,
    },

    semester: {
      type: Number,
      min: 1,
      max: 12,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    
    passwordHash: {
  type: String,
  required: true,
  select: false,
   },
  },
  {
    timestamps: true,
  }
);

// Each student ID and email must be unique
// within the same university.
studentSchema.index(
  { universityId: 1, studentId: 1 },
  { unique: true }
);

studentSchema.index(
  { universityId: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model("Student", studentSchema);
