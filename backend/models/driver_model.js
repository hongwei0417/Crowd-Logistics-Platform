import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const driverSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    trim: true,
    ref: 'User',
  },
  driver_license: {
    type: String,
    required: true
  },
  license_plate: {
    type: String,
    required: true
  },
  insurance: {
    type: String
  },
  drunk_record: {
    type: String
  },
  delivery_start_time: {
    type: Number
  },
  delivery_end_time: {
    type: Number
  },
  regular_place: {
    type: String
  },
}, {
  timestamps: true,
});

const Driver = mongoose.model('Driver', driverSchema, 'drivers');

export default Driver;