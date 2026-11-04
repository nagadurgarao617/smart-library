const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sri_vasavi_engg_smart_library_secret_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.staff = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = {
  verifyToken,
  JWT_SECRET
};
