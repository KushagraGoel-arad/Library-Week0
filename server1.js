const { gql } = require('apollo-server-express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ObjectId } = require('bson');

// PostgreSQL database setup
const sequelize = new Sequelize('dev_db', 'librarian1', 'libhead1', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

// Models setup
const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

// Define relationships
Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

// MongoDB connection for Reviews
mongoose.connect('mongodb://localhost:27017/libBook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Assuming Review model is properly defined in './models/review'
const Review = require('./models/review');

// GraphQL schema definition
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    books: [Book]
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    author: Author
    reviews: [Review]
    rating: Float
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    userId: String!
    createdAt: String
    bookId: ID!
    book: Book
  }

  type Query {
    authors(limit: Int, offset: Int, name: String, birthYear: String): [Author]
    books(limit: Int, offset: Int, title: String, author: String, publishDate: String): [Book]
    book(id: ID!): Book
  }

  input CreateBookInput {
    title: String!
    description: String
    published_date: String
    authorId: ID!
    rating: Float
  }

  input UpdateBookInput {
    id: ID!
    title: String
    description: String
    published_date: String
    authorId: ID
    rating: Float
  }

  type Mutation {
    createAuthor(name: String!, biography: String, born_date: String): Author
    updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
    deleteAuthor(id: ID!): Boolean

    createBook(input: CreateBookInput!): Book
    updateBook(input: UpdateBookInput!): Book
    deleteBook(id: ID!): Boolean

    createReview(bookId: ID!, rating: Int!, comment: String, userId: String!): Review
    updateReview(id: ID!, rating: Int!, comment: String): Review
    deleteReview(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    authors: async (parent, { limit, offset, name, birthYear }) => {
      const where = {};
      if (name) where.name = { [Op.iLike]: `%${name}%` };
      if (birthYear) where.born_date = { [Op.like]: `${birthYear}%` };

      return await Author.findAll({ where, limit, offset });
    },
    books: async (parent, { limit, offset, title, author, publishDate }) => {
      const where = {};
      if (title) where.title = { [Op.iLike]: `%${title}%` };
      if (author) {
        const authors = await Author.findAll({
          where: { name: { [Op.iLike]: `%${author}%` } },
          attributes: ['id']
        });
        where.authorId = authors.map(a => a.id);
      }
      if (publishDate) where.published_date = { [Op.like]: `${publishDate}%` };

      return await Book.findAll({ where, limit, offset });
    },
    book: async (parent, { id }) => await Book.findByPk(id)
  },
  Mutation: {
    createAuthor: async (parent, args) => await Author.create(args),
    updateAuthor: async (parent, { id, ...args }) => {
      const author = await Author.findByPk(id);
      if (!author) throw new Error('Author not found');
      return await author.update(args);
    },
    deleteAuthor: async (parent, { id }) => {
      const author = await Author.findByPk(id);
      if (!author) throw new Error('Author not found');
      await author.destroy();
      return true;
    },
    createBook: async (parent, { input }) => {
      return await Book.create(input);
    },
    updateBook: async (parent, { input }) => {
      const { id, ...args } = input;
      const book = await Book.findByPk(id);
      if (!book) {
        throw new Error('Book not found');
      }
      return await book.update(args);
    },
    deleteBook: async (parent, { id }) => {
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      await book.destroy();
      return true;
    },
    createReview: async (parent, args) => {
      const { bookId, rating, comment, userId } = args;
      if (!ObjectId.isValid(bookId)) {
        throw new Error('Invalid bookId');
      }
      const review = new Review({
        bookId: new ObjectId(bookId),
        rating,
        comment,
        userId,
        createdAt: new Date()
      });
      return await review.save();
    },
    updateReview: async (parent, { id, rating, comment }) => {
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { rating, comment },
        { new: true }
      );
      if (!updatedReview) throw new Error('Review not found');
      return updatedReview;
    },
    deleteReview: async (parent, { id }) => {
      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) throw new Error('Review not found');
      return true;
    }
  },
  Author: {
    books: async (author) => await Book.findAll({ where: { authorId: author.id } })
  },
  Book: {
    author: async (book) => await Author.findByPk(book.authorId),
    reviews: async (book) => {
      return await Review.find({ bookId: new ObjectId(book.id) });
    },
  },
  Review: {
    book: async (review) => await Book.findByPk(review.bookId)
  }
};

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected!');
    
    await sequelize.sync();
    
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    
    const app = express();
    server.applyMiddleware({ app });
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
