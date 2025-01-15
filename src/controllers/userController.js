const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try { 
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const getSingleUser = await User.findById(req.params.id);
    res.status(200).json(getSingleUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  
  const { address, dob, name, password } = req.body;

  if (!address || !dob || !name || !password) {
    return res.status(400).json({ message: 'Address, DOB, Password, and Name are required.', data: JSON.stringify(req.body) });
  } else if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  } else {
    
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);
  }

  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};