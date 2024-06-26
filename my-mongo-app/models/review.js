const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ratingSchema = new Schema({
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: String,
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  }
});

const reviewSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rating: ratingSchema 
});

const Rating = mongoose.model('Rating', ratingSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review, Rating };
