import session from "express-session";
import expressMysqlSession from 'express-mysql-session';
import dotenv from 'dotenv-flow';

dotenv.config({ quiet: true });

const MySQLStore = expressMysqlSession(session);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const sessionMiddleware = session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET || 'default_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // Session expires after 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

export default sessionMiddleware;