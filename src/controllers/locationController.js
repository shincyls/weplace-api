const Location = require('../models/locationModel');

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({
      status: 'success',
      results: locations.length,
      data: {
        locations
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getNearbyLocations = async (req, res) => {
  const { lat, lon, scale } = req.body;
  try {
    const locations = await Location.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: scale * 1000 // 1 = 1km
        }
      }
    });
    res.status(200).json({
      status: 'success',
      results: locations.length,
      data: {
        locations
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        location
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        location
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};