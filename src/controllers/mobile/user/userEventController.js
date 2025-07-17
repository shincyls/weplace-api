// For User To Post a Event

const Event = require('../models/event/eventModel');

// Create a new event
exports.createEvent = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user_id;
    data.locationId = req.location_id;
    data.title = req.body.title;
    data.description = req.body.description;
    data.venue = req.body.venue;
    data.startDatetime = req.body.startDatetime;
    data.endDatetime = req.body.endDatetime;
    data.minParticipants = req.body.minParticipants;
    data.maxParticipants = req.body.maxParticipants;
    data.tags = req.body.tags;

    const newEvent = new Event(data);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Join an event
exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID'
      });
    }
    event.participants.push(req.body.userId);
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

};


