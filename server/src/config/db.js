import mysql from 'mysql2/promise';
import dotenv from 'dotenv-flow';

dotenv.config({ quiet: true});

let db;

try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });


  console.log('Successfully connected to WDMS Database.');
} catch (error) {
  console.error('Failed to connect to WDMS database.');
  process.exit(1); // Exit the app if DB connection fails
}

export default db;
