const Admin = require('../models/admin/adminModel');
const bcrypt = require('bcryptjs');

// Basic CRUD
exports.getAllAdmins = async (req, res) => {
  try { 
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const getAdmin = await User.findById(req.params.id);
    res.status(200).json(getAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  
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
    const newAdmin = await Admin.create(req.body);
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

exports.updateAdmin = async (req, res) => {
  try {
    const updateAdmin = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAdminPassword = async (req, res) => {
  try {
    const password = req.body.password;
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      } else {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
    }
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
