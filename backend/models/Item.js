const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['freefire', 'youtube', 'tiktok', 'diamonds'] 
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary base64 or Direct Image URL
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  // Specific features for accounts
  level: { type: Number },
  skins: { type: String },
  subscribers: { type: String },
  followers: { type: String },
  // Specific features for diamonds
  diamondCount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
