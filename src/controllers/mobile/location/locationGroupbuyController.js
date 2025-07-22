const Location = require('../../../models/location/locationModel');
const GroupBuy = require('../../../models/groupbuy/groupBuyModel');

exports.getLocationGroupbuys = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    const groupbuys = await GroupBuy.find({
      locationId: req.params.id
    });
    res.status(200).json({
      status: 'success',
      results: groupbuys.length,
      data: {
        groupbuys
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

};
