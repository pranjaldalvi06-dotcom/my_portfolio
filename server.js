const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Make sure db.js exists

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(express.static('public')); // optional for frontend files

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Contact form
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).send('Missing fields');

  try {
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));