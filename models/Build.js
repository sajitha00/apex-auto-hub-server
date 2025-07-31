const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  selectedParts: [{
    type: String
  }],
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Build', buildSchema);