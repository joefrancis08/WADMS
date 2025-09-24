// Import necessary dependencies
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv-flow';
import sessionMiddleware from './src/middlewares/session.js';
import corsMiddleware from './src/middlewares/cors.js';
import userRouter from './src/routes/userRoute.js';
import setupWebSocket from './src/config/ws.js';
import programRouter from './src/routes/programRoute.js';
import accreditationRouter from './src/routes/accreditationRoute.js';
import areaRouter from './src/routes/areaRoute.js';
import parameterRouter from './src/routes/parameterRoute.js';
import authRouter from './src/routes/authRoute.js';

dotenv.config({ quiet: true });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROFILE_PIC_PATH = process.env.PROFILE_PIC_PATH;
const DOCUMENT_PATH = process.env.ACCREDITATION_DOCUMENT_PATH;

// Create the instance of express application which serves as the backbone of the server
const app = express();

const port = process.env.PORT || 5000; // Configure the port to specify where the server listen for incoming request

app.use(corsMiddleware); // Use the custom CORS middleware
app.use(sessionMiddleware); // Middleware for session management
app.use(express.json()); // Passing json data from incoming http request
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// Add this in your server.js after routes
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/accreditation', accreditationRouter);
app.use('/programs', programRouter);
app.use('/areas', areaRouter);
app.use('/parameters', parameterRouter);

const server = http.createServer(app);
setupWebSocket(server);

// Serve profile pictures
app.use('/uploads', express.static(path.join(PROFILE_PIC_PATH)));

// Serve accreditation documents
app.use('/uploads/accreditation-documents', express.static(path.join(DOCUMENT_PATH)));

// Catch-all route to serve React index.html
app.get(/^\/(?!users|programs|accreditation).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

// Start the server to make it ready to response to incoming request
server.listen(port, () => {
    console.log(`HTTP and WebSocket server running at Port ${port}.`); 
})
