const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String },
  userId: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;