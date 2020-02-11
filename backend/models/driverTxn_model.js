import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const driverTxnModel = new Schema({
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
  }
}, {
  timestamps: true,
});

const DriverTxn = mongoose.model('DriverTxn', driverTxnModel, 'driverTxns');

export default DriverTxn;