const pool = require("../db"); // DB connection from separate file

exports.saveSession = async (req, res) => {
  try {
    const {
      name, age, gender, email, phone,
      counselingType, counselor, date, time, rating
    } = req.body;

    const query = `
      INSERT INTO counseling_sessions
      (name, age, gender, email, phone, counseling_type, counselor, date, time, rating)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id
    `;
    const values = [name, age, gender, email, phone, counselingType, counselor, date, time, rating || null];
    const result = await pool.query(query, values);

    res.json({ success: true, message: "Session saved!", sessionId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving session" });
  }
};
