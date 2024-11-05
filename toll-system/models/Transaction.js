// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  mpesaReceiptNumber: {
    type: String
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  checkoutRequestID: {
    type: String
  },
  merchantRequestID: {
    type: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;