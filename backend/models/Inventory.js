const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    unique: true,
    trim: true
  },
  produceType: {
    type: String,
    required: [true, 'Produce type is required'],
    enum: ['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']
  },
  availableStock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
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
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update timestamp on save
inventorySchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Virtual for low stock status
inventorySchema.virtual('isLowStock').get(function() {
  return this.availableStock < 1000;
});

// Virtual for out of stock status
inventorySchema.virtual('isOutOfStock').get(function() {
  return this.availableStock <= 0;
});

module.exports = mongoose.model('Inventory', inventorySchema);