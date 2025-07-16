// Import necessary dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv-flow';
import sessionMiddleware from './src/middlewares/session.js';
import corsMiddleware from './src/middlewares/cors.js';
import userRouter from './src/routes/userRoute.js';

dotenv.config({ quiet: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create the instance of express application which serves as the backbone of the server
const app = express();

const port = process.env.PORT || 5000; // Configure the port to specify where the server listen for incoming request

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads'directory
app.use(corsMiddleware); // Use the custom CORS middleware
app.use(sessionMiddleware); // Middleware for session management
app.use(express.json()); // Passing json data from incoming http request
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

app.get('/', (req, res) => {
    res.send('Server is running.');
})

app.use('/users', userRouter);

// Start the server to make it ready to response to incoming request
app.listen(port, () => {
    console.log(`Server running at Port ${port}`); 
})
