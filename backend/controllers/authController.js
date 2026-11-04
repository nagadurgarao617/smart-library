const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAsync } = require('../database/database');
const { JWT_SECRET } = require('../middleware/auth');

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const staffMember = await getAsync(`SELECT * FROM staff WHERE username = ?`, [username.trim()]);
    if (!staffMember) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, staffMember.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const payload = {
      id: staffMember.id,
      username: staffMember.username,
      name: staffMember.name,
      role: staffMember.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Authentication successful',
      token,
      staff: payload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

async function getProfile(req, res) {
  try {
    const staff = await getAsync(`SELECT id, username, name, role, created_at FROM staff WHERE id = ?`, [req.staff.id]);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }
    res.json({ staff });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

module.exports = {
  login,
  getProfile
};
