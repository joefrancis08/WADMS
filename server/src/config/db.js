import mysql from 'mysql2/promise';
import dotenv from 'dotenv-flow';

dotenv.config({ quiet: true});

let db;

/* 
  Create a MySQL connection pool instead of a single connection.
  A pool keeps multiple connections open (default: 10 in this config)
  and automatically manages them for better performance & scalability.
*/
try {
  db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log('Successfully connected to WDMS Database.');

} catch (error) {
  console.error('Failed to connect to WDMS database.');
  process.exit(1); // Exit the app if DB connection fails
}

export default db;
