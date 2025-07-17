const mongoose = require('mongoose');

const newsfeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
  tags: [{ type: String }],
  replies: [
    { 
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Newsfeed = mongoose.model('Newsfeed', newsfeedSchema);

module.exports = {Newsfeed};
