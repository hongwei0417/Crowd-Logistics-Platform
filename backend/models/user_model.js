import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  sex: { 
    type: Number,
    default: null
  },
  birthday: { 
    type: Date,
    default: null
  },
  phone_number: { 
    type: String, 
    required: true, 
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  cid: {
    type: String,
    trim: true,
    default: null
  },
  psd: {
    type: String,
    required: true,
    trim: true
  },
  psd_hint: {
    type: String,
    default: null
  },
  account: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    privateKey: {
      type: String,
      required: true,
      trim: true
    }
  },
  
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema, 'users');

export default User;