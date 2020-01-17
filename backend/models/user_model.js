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
  sex: { type: Number },
  birthday: { type: Date },
  phone_number: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  cid: { type: String, trim: true },
  psd: { type: String, required: true, trim: true },
  psd_hint: { type: String }
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema, 'users');

export default User;