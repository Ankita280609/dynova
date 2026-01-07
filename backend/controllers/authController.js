const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed });
    await user.save();

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
