const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  activationToken: { type: String },
  resetToken: { type: String },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
