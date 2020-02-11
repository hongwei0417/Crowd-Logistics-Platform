import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionModel = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    trim: true,
    ref: 'users'
  },
  transactions: {
    type: Object,
    default: {}
  },
  orders: {
    type: Array,
    default: []
  },
  orderNumber: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionModel, 'transactions');

export default Transaction;