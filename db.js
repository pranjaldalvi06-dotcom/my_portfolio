const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'veda',
  database: 'pranjal'
});

app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.send('Message saved!');
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));