const mongoose = require('mongoose');
const { Review, Rating } = require('./models/review');

mongoose.connect('mongodb://localhost:27017/libBook');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to MongoDB!');
  
  const sampleRating = new Rating({
    value: 5,
    user: 'Kushagra Goel',
    book: new mongoose.Types.ObjectId()
  });

  const sampleReview = new Review({
    content: 'Great book!',
    user: 'user1',
    book: sampleRating.book,
    rating: sampleRating
  });

//   try {
//     await sampleRating.save();
//     console.log('Rating saved');

//     await sampleReview.save();
//     console.log('Review saved');
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close();
//   }
// });

sampleRating.save((err) => {
    if (err) return console.error(err);
    console.log('Rating saved');
  });

  sampleReview.save((err) => {
    if (err) return console.error(err);
    console.log('Review saved');

    mongoose.connection.close();
  });
});
