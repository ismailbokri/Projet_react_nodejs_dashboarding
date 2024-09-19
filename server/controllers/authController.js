const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

// Mock user for static login
const staticUser = {
  username: 'admin',
  password: 'admin'
};

// Authenticate user and generate JWT
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === staticUser.username && password === staticUser.password) {
    const token = jwt.sign({ username: staticUser.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
