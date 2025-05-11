import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

export default authUser;
