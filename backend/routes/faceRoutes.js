
const express = require("express");

const {
  getFaceServiceHealth,
} = require("../controllers/faceController");

const router = express.Router();

router.get("/health", getFaceServiceHealth);

module.exports = router;
