import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow all in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Allow only if origin is in the list
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Block request if origin is not allowed
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

export default corsMiddleware;
