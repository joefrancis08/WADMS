import mysql from 'mysql2/promise';
import dotenv from 'dotenv-flow';

dotenv.config({ quiet: true });

let db;

try {
  // Create a pool
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test the connection
  const connection = await db.getConnection();
  await connection.ping(); // Optional: test server responsiveness
  connection.release();

  console.log('Successfully connected to WDMS Database.');
} catch (error) {
  console.error('Failed to connect to WDMS database.', error);
  process.exit(1); // Exit if DB connection fails
}

export default db;
