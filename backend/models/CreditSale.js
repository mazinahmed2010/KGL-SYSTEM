const mongoose = require('mongoose');

const creditSaleSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: [true, 'Buyer name is required'],
    minlength: [2, 'Buyer name must be at least 2 characters']
  },
  nationalId: {
    type: String,
    required: [true, 'National ID is required'],
    match: [/^[A-Z0-9]{10,15}$/, 'Invalid National ID format (e.g., CM12345678)']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    minlength: [2, 'Location must be at least 2 characters']
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  amountDue: {
    type: Number,
    required: [true, 'Amount due is required'],
    min: [10000, 'Minimum amount is 10000 UGX']
  },
  agentName: {
    type: String,
    required: [true, 'Agent name is required'],
    minlength: [2, 'Agent name must be at least 2 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  produceName: {
    type: String,
    required: [true, 'Produce name is required']
  },
  produceType: {
    type: String,
    required: [true, 'Produce type is required'],
    enum: ['Beans', 'Grain Maize', 'Cow peas', 'G-nuts', 'Soybeans']
  },
  tonnage: {
    type: Number,
    required: [true, 'Tonnage is required'],
    min: [1, 'Tonnage must be at least 1kg']
  },
  dateOfDispatch: {
    type: Date,
    required: true,
    default: Date.now
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: ['Maganjo', 'Matugga']
  },
  status: {
    type: String,
    enum: ['pending', 'partially paid', 'paid', 'overdue'],
    default: 'pending'
  },
  amountPaid: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Check if overdue
creditSaleSchema.methods.isOverdue = function() {
  return new Date() > this.dueDate && this.status !== 'paid';
};

// Update status
creditSaleSchema.methods.updateStatus = function() {
  if (this.amountPaid >= this.amountDue) {
    this.status = 'paid';
  } else if (this.amountPaid > 0) {
    this.status = 'partially paid';
  } else if (this.isOverdue()) {
    this.status = 'overdue';
  }
};

module.exports = mongoose.model('CreditSale', creditSaleSchema);