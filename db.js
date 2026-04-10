const mysql = require("mysql2/promise");

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test DB connection (important for debugging)
pool.getConnection()
  .then(conn => {
    console.log("MySQL Connected Successfully ✅");
    conn.release();
  })
  .catch(err => {
    console.error("MySQL Connection Failed ❌:", err.message);
  });

module.exports = pool;