const Location = require('../models/location/locationModel');
const Event = require('../models/event/eventModel');

exports.getLocationEvents = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    const events = await Event.find({
      locationId: req.params.id
    });
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

};
