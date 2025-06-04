// Install necessary dependencies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

// Create the instance of express application which serves as the backbone of the server
const app = express();


app.use(express.static(path.join(__dirname, "public"))); // Set up middleware functions to serve static files from the client-side
app.use(cors()); // Cross-origin resource sharing (cors) for security purposes
app.use(express.json()); // Passing json data from incoming http request

const port = 5000; // Configure the port to specify where the server listen for incoming request

// Establish connection with MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: " ",
    database: "wdms"
});





// Start the server to make it ready to response to incoming request
app.listen(port, () => {
    console.log('Listening at Port 5000'); 
})
