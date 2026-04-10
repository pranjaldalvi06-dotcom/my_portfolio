const express = require("express");
const cors = require("cors");
const path = require("path");

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONTACT API
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const [result] = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    console.log("Inserted ID:", result.insertId);

    res.send("Message saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});
// debug code
app.get("/debug", async (req, res) => {
  try {
    const [db] = await pool.query("SELECT DATABASE() as db");
    const [tables] = await pool.query("SHOW TABLES");
    const [rows] = await pool.query("SELECT * FROM contacts");

    res.json({ db, tables, rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// STATIC FRONTEND
app.use(express.static(path.join(__dirname, "pranjal-v2")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pranjal-v2", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});