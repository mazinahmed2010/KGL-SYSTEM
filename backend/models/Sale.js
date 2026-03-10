const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: [true, 'Produce name is required'],
    trim: true
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [1, 'Tonnage must be at least 1kg']
  },
  amountPaid: {
    type: Number,
    required: [true, 'Amount paid is required'],
    min: [10000, 'Minimum amount is 10000 UGX']
  },
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    minlength: [2, 'Buyer name must be at least 2 characters']
  },
  agentName: {
    type: String,
    required: [true, 'Agent name is required'],
    minlength: [2, 'Agent name must be at least 2 characters']
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
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: ['Maganjo', 'Matugga']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile money', 'bank transfer'],
    default: 'cash'
  }
}, {
  timestamps: true
});

// Virtual for unit price
saleSchema.virtual('unitPrice').get(function() {
  return this.amountPaid / this.tonnage;
});

module.exports = mongoose.model('Sale', saleSchema);