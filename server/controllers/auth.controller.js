const Organizer = require('../models/Organizer');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;
    const existingOrganizer = await Organizer.findOne({ email });

    if (existingOrganizer) {
      return res.status(400).json({ message: 'Organizer already exists' });
    }

    const organizer = await Organizer.create({ name, email, password, organization });

    res.status(201).json({
      _id: organizer._id,
      name: organizer.name,
      email: organizer.email,
      token: generateToken(organizer._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const organizer = await Organizer.findOne({ email });

    if (organizer && (await organizer.comparePassword(password))) {
      res.json({
        _id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        token: generateToken(organizer._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.user.id).select('-password');
    res.json(organizer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
