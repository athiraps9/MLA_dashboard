const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log("Access denied. No token provided.");
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      console.log("req.user", req.user);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
};

module.exports = auth;
