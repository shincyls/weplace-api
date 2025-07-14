const User = require('../models/user/userModel');
const UserCreditBalance = require('../models/user/userCreditBalanceModel');
const ProductReview = require('../models/product/productReviewModel');
const ProductReport = require('../models/product/productReportModel');
const SellerReview = require('../models/seller/sellerReviewModel');
const SellerReport = require('../models/seller/sellerReportModel');
const bcrypt = require('bcryptjs');


exports.getUser = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json(getUser);
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

exports.updateUserPassword = async (req, res) => {
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
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserLocation = async (req, res) => {
  try {
    const location = req.body.location;
    if (location) {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } else {
      res.status(400).json({ message: 'Location is required.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.registerOrUpdateDevice = async (req, res) => {
  try {
    const userId = req.params.id;
    const { deviceToken, deviceType, appVersion, deviceId } = req.body;
    if (!deviceToken || !deviceType) {
      return res.status(400).json({ message: 'deviceToken and deviceType are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find device by deviceId or deviceToken
    let deviceIndex = user.devices.findIndex(
      d => (deviceId && d.deviceId === deviceId) || d.deviceToken === deviceToken
    );

    if (deviceIndex !== -1) {
      // Update existing device
      user.devices[deviceIndex].deviceToken = deviceToken;
      user.devices[deviceIndex].deviceType = deviceType;
      user.devices[deviceIndex].appVersion = appVersion;
      user.devices[deviceIndex].deviceId = deviceId;
      user.devices[deviceIndex].lastActive = new Date();
    } else {
      // Add new device
      user.devices.push({
        deviceToken,
        deviceType,
        appVersion,
        deviceId,
        lastActive: new Date()
      });
    }

    await user.save();
    res.status(200).json({ message: 'Device registered/updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

