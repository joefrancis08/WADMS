import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

const JWTSign = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      profilePicPath: user.profilePicPath,
      role: user.role,
      status: user.status
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return token;
};

export default JWTSign;
