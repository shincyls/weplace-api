const User = require('../../../models/user/userModel');
const UserCreditBalance = require('../../../models/user/userCreditBalanceModel');
const Location = require('../../../models/location/locationModel');
const bcrypt = require('bcryptjs');

exports.showUser = async (req, res) => {
  try {
    const showUser = await User.findById(req.user_id);
    res.status(200).json(showUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const updatedUserProfile = await User.findByIdAndUpdate(req.user_id, req.body);
    res.status(200).json(updatedUserProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const newPassword = "";
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
      } else {
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(password, salt);
      }
    }
    const updatedUserPassword = await User.findByIdAndUpdate(
      req.user_id, 
      {"password" : newPassword}
    );
    res.status(200).json(updatedUserPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserLocation = async (req, res) => {
  try {
    const newLocationId = req.body.newLocationId;

    if (!newLocationId) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    const isExist = await Location.findById(newLocationId);

    if (!isExist) {
      return res.status(400).json({ message: 'Location does not exist.' });
    }

    const updatedUserLocation = await User.findByIdAndUpdate(
      req.user_id, 
      {"locationId" : newLocationId}
    );
    res.status(200).json(updatedUserLocation);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

