import mongoose from 'mongoose';
require('mongoose-long')(mongoose)

const Schema = mongoose.Schema;
const orderModel = new Schema({
  uuid: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true,
    ref: 'User'
  },
  duid: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true,
    ref: 'User'
  },
  txnTime: {
    type: Schema.Types.Long
  },
  status: {
    type: String
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true } 
});


orderModel.virtual('driver', {
  ref: 'Driver',
  localField: 'duid',
  foreignField: 'uid',
})


const Order = mongoose.model('Order', orderModel, 'orders');

export default Order;