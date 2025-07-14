const User = require('../models/user/userModel');
const UserCreditBalance = require('../models/user/userCreditBalanceModel');
const ProductReview = require('../models/product/productReviewModel');
const ProductReport = require('../models/product/productReportModel');
const SellerReview = require('../models/seller/sellerReviewModel');
const SellerReport = require('../models/seller/sellerReportModel');
const bcrypt = require('bcryptjs');

// Basic CRUD
exports.getAllUsers = async (req, res) => {
  try { 
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json(getUser);
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

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Advanced Requirements
exports.userProductsLive = async (req, res) => {
  try {
    const today = new Date();
    const liveProducts = await ProductOrder.find({
      startTime: { $lt: today },
      endTime: { $gt: today },
      locationId: { $in: req.user.location_id }
    });
    res.status(200).json(liveProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userProductsHistory = async (req, res) => {
  try {
    const today = new Date();
    const historyProducts = await ProductOrder.find({
      endTime: { $lt: today },
      locationId: { $in: req.user.location_id },
      sellerId: req.user.id
    });
    res.status(200).json(historyProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userProductOrderUserAdd = async (req, res) => {
  try {
    const { productOrderId, productId, orderUnit, orderRemarks, orderOption } = req.body;
    const userId = req.user._id;

    const newProductOrderUser = await ProductOrderUser.create({
      productOrderId,
      productId,
      userId,
      orderUnit,
      orderRemarks,
      orderOption
    });

    res.status(201).json(newProductOrderUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.userProductOrderUserPayment = async (req, res) => {
  try {
    const { productOrderId, paymentInfo, paymentType } = req.body;

    const updatedProductOrderUser = await ProductOrderUser.findOneAndUpdate(
      { productOrderId },
      { paymentInfo, paymentType, paymentStatus: true },
      { new: true }
    );

    res.status(200).json(updatedProductOrderUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.userProductOrderUserCancel = async (req, res) => {
  try {
    const { productOrderId } = req.body;

    const updatedProductOrderUser = await ProductOrderUser.findOneAndUpdate(
      { productOrderId },
      { orderStatus: false },
      { new: true }
    );

    res.status(200).json(updatedProductOrderUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.userProductUserReview = async (req, res) => {
  try {
    const { productOrderId, review } = req.body;
    const userId = req.user._id;

    const newProductUserReview = await ProductUserReview.create({
      productOrderId,
      userId,
      review
    });

    res.status(201).json(newProductUserReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Register or update a device for push notifications
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

