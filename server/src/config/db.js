import mysql from 'mysql2/promise'; // Use the promise version

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wdms',
});

export default db;



