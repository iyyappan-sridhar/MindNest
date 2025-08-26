require("dotenv").config();
console.log("SID =>", process.env.TWILIO_ACCOUNT_SID); // debug
console.log("TOKEN =>", process.env.TWILIO_AUTH_TOKEN ? "Loaded" : "Missing");

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const pool = require("./db");   // DB connection file
const app = express();
const PORT = 8080;

// Twilio client
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// 👉 Root route - load index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 👉 Counseling form API
app.post("/api/counseling", async (req, res) => {
  console.log("📥 Received booking data:", req.body);

  try {
    const { name, age, gender, email, phone, counselingType, counselor, date, time, rating } = req.body;

    // Save to DB
    const newSession = await pool.query(
      `INSERT INTO counseling_sessions 
      (name, age, gender, email, phone, counseling_type, counselor, date, time, rating) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, age, gender, email, phone, counselingType, counselor, date, time, rating]
    );

    // ✅ Send WhatsApp Notification via Twilio
    await client.messages.create({
      body: `📌 New Counseling Booking\nName: ${name}\nDate: ${date}\nTime: ${time}\nCounselor: ${counselor || "Not selected"}`,
      from: "whatsapp:+14155238886",   // Twilio sandbox number
      to: `whatsapp:${process.env.MY_PHONE_NUMBER}` // your verified number
    });

    res.json({ message: "✅ Counseling session saved & WhatsApp sent!" });
    
  } catch (err) {
    console.error("❌ Error saving session:", err);
    res.status(500).json({ error: "Error saving session" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
