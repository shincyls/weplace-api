// For User To Post a Newsfeed 

const Newsfeed = require('../../../models/newsfeed/newsfeedModel');

// Create a new newsfeed
exports.createNewsfeed = async (req, res) => {
  try {

    let data = req.body;
    data.userId = req.user.id;
    data.locationId = req.location.id;
    data.title = req.body.title;
    data.content = req.body.content;
    data.attachments = req.body.attachments;

    const newNewsfeed = new Newsfeed(data);
    const savedNewsfeed = await newNewsfeed.save();
    res.status(201).json(savedNewsfeed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reply to a newsfeed
exports.replyNewsfeed = async (req, res) => {
    try {
      const newsfeed = await Newsfeed.findById(req.params.id);
      if (!newsfeed) {
        return res.status(404).json({
          status: 'fail',
          message: 'No newsfeed found with that ID'
        });
      }
      newsfeed.replies.push(req.body.userId);
      await newsfeed.save();
      res.status(200).json(newsfeed);
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }

};


// Add a like
exports.addLike = async (req, res) => {
    try {
      const newsfeed = await Newsfeed.findById(req.params.id);
      if (!newsfeed) {
        return res.status(404).json({
          status: 'fail',
          message: 'No newsfeed found with that ID'
        });
      }
      newsfeed.likes.push(req.body.userId);
      await newsfeed.save();
      res.status(200).json(newsfeed);
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
};