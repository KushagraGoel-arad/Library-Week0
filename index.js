const { gql } = require('apollo-server-express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const mongoose = require('mongoose');
const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);
const Review = require('./models/review'); 

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
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    userId: String!
    createdAt: String
    book: Book
  }

  type Query {
    authors(limit: Int, offset: Int, name: String, birthYear: String): [Author]
    books(limit: Int, offset: Int, title: String, author: String, publishDate: String): [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createAuthor(name: String!, biography: String, born_date: String): Author
    updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
    deleteAuthor(id: ID!): Boolean

    createBook(title: String!, description: String, published_date: String, authorId: ID!): Book
    updateBook(id: ID!, title: String, description: String, published_date: String, authorId: ID!): Book
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
      return await author.update(args);
    },
    deleteAuthor: async (parent, { id }) => {
      const author = await Author.findByPk(id);
      await author.destroy();
      return true;
    },
    createBook: async (parent, args) => await Book.create(args),
    updateBook: async (parent, { id, ...args }) => {
      const book = await Book.findByPk(id);
      return await book.update(args);
    },
    deleteBook: async (parent, { id }) => {
      const book = await Book.findByPk(id);
      await book.destroy();
      return true;
    },
    createReview: async (parent, args) => {
      const review = new Review(args);
      return await review.save();
    },
    updateReview: async (parent, { id, ...args }) => {
      return await Review.findByIdAndUpdate(id, args, { new: true });
    },
    deleteReview: async (parent, { id }) => {
      await Review.findByIdAndDelete(id);
      return true;
    }
  },
  Author: {
    books: async (author) => await Book.findAll({ where: { authorId: author.id } })
  },
  Book: {
    author: async (book) => await Author.findByPk(book.authorId),
    reviews: async (book) => await Review.find({ bookId: book.id })
  },
  Review: {
    book: async (review) => await Book.findByPk(review.bookId)
  }
};

// Server setup
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const sequelize = new Sequelize('dev_db', 'librarian1', 'libhead1', {
  host: '127.0.0.1',
  dialect: 'postgres',
});

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
