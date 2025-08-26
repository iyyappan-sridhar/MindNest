const express = require("express");
const router = express.Router();
const { saveSession } = require("../controllers/sessionController");

// POST route
router.post("/save-session", saveSession);

module.exports = router;
