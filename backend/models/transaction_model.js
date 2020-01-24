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
    type: Array,
    default: null
  }
  
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionModel, 'transactions');

export default Transaction;