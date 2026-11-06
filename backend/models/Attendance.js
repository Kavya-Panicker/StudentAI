
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present"],
      default: "Present",
      required: true,
    },

    method: {
      type: String,
      enum: ["face-recognition"],
      default: "face-recognition",
      required: true,
    },

    faceMatchConfidence: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    markedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student on the same date.
attendanceSchema.index(
  {
    studentId: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  }
);

// Help retrieve attendance records for a university by date.
attendanceSchema.index({
  universityId: 1,
  attendanceDate: 1,
});

module.exports = mongoose.model("Attendance", attendanceSchema);
