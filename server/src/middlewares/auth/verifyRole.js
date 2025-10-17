const verifyRole = (roles) => {
  return (req, res, next) => {
    const user = req.user; // set by verifyJWT

    if (!user) {
      return res.status(403).json({ message: 'Access denied. Unauthorized user.' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
    }

    next();
  };
};

export default verifyRole;
