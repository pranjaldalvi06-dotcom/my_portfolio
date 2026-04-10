const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

// 🔥 Test connection immediately
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ DB CONNECTED SUCCESSFULLY");
    conn.release();
  } catch (err) {
    console.error("❌ DB CONNECTION FAILED:", err.message);
  }
})();

module.exports = pool;