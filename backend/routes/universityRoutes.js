
const express = require("express");

const {
  createUniversity,
  getUniversities,
} = require("../controllers/universityController");

const router = express.Router();

router.post("/", createUniversity);
router.get("/", getUniversities);

module.exports = router;
