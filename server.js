const express = require("express");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysql = require("mysql2");

// ✅ CREATE POOL WITH PROMISE SUPPORT
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
}).promise(); // ⭐ IMPORTANT

// ✅ API route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("Incoming data:", name, email, message); // debug

    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    console.log("Data inserted ✅");

    res.send("Message saved!");
  } catch (err) {
    console.error("DB ERROR ❌:", err);
    res.status(500).send("Database error");
  }
});
// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "pranjal-v2")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pranjal-v2", "index.html"));
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});