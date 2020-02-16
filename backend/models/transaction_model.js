import mongoose from 'mongoose';
require('mongoose-long')(mongoose)


const Schema = mongoose.Schema;

const transactionModel = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true, 
    ref: 'User'
  },
  txnTime: {
    type: Schema.Types.Long,
    required: true,
  },
  receipt: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
});


const Transaction = mongoose.model('Transaction', transactionModel, 'transactions');

export default Transaction;