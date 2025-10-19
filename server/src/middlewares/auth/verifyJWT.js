import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = () => {
  return (req, res, next) => {
    // Try to get token from both header and cookie
    let token;

    // Prefer Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Fallback: check cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // No token at all
    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid or expired token.',
        });
      }

      // Attach decoded data to request
      req.user = decoded;

      // Optionally set session (if you still use sessions elsewhere)
      if (req.session) {
        req.session.user = decoded;
      }

      next();
    });
  };
};

export default verifyJWT;
