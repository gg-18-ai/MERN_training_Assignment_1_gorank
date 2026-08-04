const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and protect routes
const protect = (req, res, next) => {
  try {
    // 1. Get token from cookies or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. If token does not exist, return unauthorized response
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 3. Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey12345');

    // 4. Attach decoded user payload to req object
    req.user = decoded;

    // 5. Call next() to proceed to the next handler/route
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = protect;
