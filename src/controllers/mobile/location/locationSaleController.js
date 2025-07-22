const Location = require('../../../models/location/locationModel');
const Sale = require('../../../models/sale/saleModel');

exports.getLocationSales = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({
        status: 'fail',
        message: 'No location found with that ID'
      });
    }
    const sales = await Sale.find({
      locationId: req.params.id
    });
    res.status(200).json({
      status: 'success',
      results: sales.length,
      data: {
        sales
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }

};
