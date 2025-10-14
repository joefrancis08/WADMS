import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5000'];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow all in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Allow only if origin is in the list
    if (!origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Block request if origin is not allowed
    return callback(new Error(`Not allowed by CORS: ${origin || 'No Origin'}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default corsMiddleware;
