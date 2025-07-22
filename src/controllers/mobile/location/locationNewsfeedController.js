const Location = require('../../../models/location/locationModel');
const Newsfeed = require('../../../models/newsfeed/newsfeedModel');

exports.getLocationNewsfeed = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    } 
    const newsfeed = await Newsfeed.find({
      locationId: req.params.id
    });
    res.status(200).json({
      status: 'success',
      results: newsfeed.length,
      data: {
        newsfeed
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

};
