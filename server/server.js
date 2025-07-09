// Import necessary dependencies
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv-flow';
import router from './src/routes/userRoute.js';
import sessionMiddleware from './src/middlewares/session.js';

dotenv.config({ quiet: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create the instance of express application which serves as the backbone of the server
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cross-origin resource sharing (cors) for security purposes
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Only allow requests from these origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    credentials: true
}));

app.use(sessionMiddleware);
app.use(express.json()); // Passing json data from incoming http request
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000; // Configure the port to specify where the server listen for incoming request

app.get('/', (req, res) => {
    res.send('Server is running.');
})

app.use('/users', router);

// Start the server to make it ready to response to incoming request
app.listen(port, () => {
    console.log(`Server running at Port ${port}`); 
})
