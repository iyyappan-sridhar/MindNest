const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.static("public")); // serve your HTML, CSS, JS from public folder

// ✅ Create table once
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counseling_sessions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT,
        gender VARCHAR(10),
        email VARCHAR(100),
        phone VARCHAR(20),
        counseling_type VARCHAR(100),
        counselor VARCHAR(100),
        date DATE,
        time TIME,
        rating INT
      )
    `);
    console.log("✅ counseling_sessions table ready");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  }
}
createTable();

// ✅ API route to save data
app.post("/api/counseling", async (req, res) => {
  try {
    const { name, age, gender, email, phone, counselingType, counselor, date, time, rating } = req.body;

    await pool.query(
      "INSERT INTO counseling_sessions (name, age, gender, email, phone, counseling_type, counselor, date, time, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [name, age, gender, email, phone, counselingType, counselor, date, time, rating]
    );

    res.json({ message: "✅ Counseling session saved successfully" });
  } catch (err) {
    console.error("❌ DB Insert Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// ✅ View all saved sessions
app.get("/api/counseling/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM counseling_sessions ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const newSession = await pool.query(
  `INSERT INTO counseling_sessions (name, age, gender, email, phone, counseling_type, counselor, date, time)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
  [name, age, gender, email, phone, counselingType, counselor, date, time]
);
