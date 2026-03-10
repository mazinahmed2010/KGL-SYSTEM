const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    trim: true
  },
  produceType: {
    type: String,
    required: [true, 'Produce type is required'],
    enum: ['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  time: {
    type: String,
    required: true
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [1000, 'Minimum tonnage is 1000kg']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: [10000, 'Minimum cost is 10000 UGX']
  },
  dealerName: {
    type: String,
    required: [true, 'Dealer name is required'],
    minlength: [2, 'Dealer name must be at least 2 characters']
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [1000, 'Price must be at least 1000 UGX']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: ['Maganjo', 'Matugga']
  },
  recordedBy: {
    type: String,
    default: 'manager'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Procurement', procurementSchema);