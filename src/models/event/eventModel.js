const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  venue: { type: String, required: true },
  startDatetime: { type: Date, required: true },
  endDatetime: { type: Date, required: true },
  minParticipants: { type: Number, default: 1, required: true },
  maxParticipants: { type: Number },
  attachments: [{ type: String }],
  joiners: [
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['Yes', 'No', 'Maybe'], default: 'Yes' }
    },
  ],
  comments: [
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
  ],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {Event};
