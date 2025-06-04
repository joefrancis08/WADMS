// Install necessary dependencies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

// Create the instance of express application which serves as the backbone of the server
const app = express();


app.use(express.static(path.join(__dirname, "public"))); // Set up middleware functions to serve static files from the client-side

// Cross-origin resource sharing (cors) for security purposes
app.use(cors({
  origin: 'http://localhost:5174'
})); 

app.use(express.json()); // Passing json data from incoming http request

const port = 5000; // Configure the port to specify where the server listen for incoming request

// Establish connection with MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wdms"
});

app.post('/register_user', (req, res) => {

    const { 
        fullName, 
        email, 
        password, 
        role = "Unverified User", 
        status = "Pending", } = req.body; // Destructure the request body to get the data

    // SQL query to insert the data into the database
    const sql = "INSERT INTO user (full_name, email, password, role, status) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [fullName, email, password, role, status], (err, result) => {
        if (err) {
            return res.json({message: "Error inserting data" + err}); // If there is an error, send a response with the error message  
        } else {
            return res.json({message: "Data inserted successfully"}); // If the data is inserted successfully, send a response with a success message
        }
    });
});



// Start the server to make it ready to response to incoming request
app.listen(port, () => {
    console.log('Listening at Port 5000'); 
})
