const express = require("express");
const attendanceRoutes = require("./routes/attendanceRoutes");
const cors = require("cors");
const faceRoutes = require("./routes/faceRoutes");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config(); // Also check root if present

const connectDB = require("./config/db");
const universityRoutes = require("./routes/universityRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/attendance", attendanceRoutes);
app.use("/api/face", faceRoutes);

// Homepage test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to StudentAI Backend!",
    status: "Server is running successfully",
  });
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "StudentAI API is healthy",
  });
});

// University API routes
app.use("/api/universities", universityRoutes);

// Student API routes
app.use("/api/students", studentRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `StudentAI server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start StudentAI server:",
      error.message
    );
    process.exit(1);
  }
};

startServer();
