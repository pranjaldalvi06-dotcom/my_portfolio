const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve frontend (pranjal-v2 folder)
app.use(express.static(path.join(__dirname, "pranjal-v2")));

// ✅ Example API route (optional - you can remove if not needed)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

// ✅ Default route (load index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pranjal-v2", "index.html"));
});

// ✅ Handle 404 (optional but good practice)
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ✅ PORT for Railway
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
