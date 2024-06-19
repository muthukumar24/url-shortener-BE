const mongoose = require('mongoose');
const shortid = require('shortid');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, default: shortid.generate },
  clickCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Url = mongoose.model('Url', UrlSchema);
module.exports = Url;
