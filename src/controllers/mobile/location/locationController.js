const Location = require('../../../models/location/locationModel');

exports.getLocations = async (req, res) => {
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