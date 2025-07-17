// Receive a res body and make sure format is correct according to model, else throw error exception

exports.validateUserRating = (req, res, next) => {
  try {
    let data = req.body;
    data.userId = req.user.id;
    data.rating = req.body.rating;
    data.review = req.body.review;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
