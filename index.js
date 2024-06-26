const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('dev_db', 'librarian1', 'libhead1', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

const Author = require('./models/author')(sequelize, DataTypes);
const Book = require('./models/book')(sequelize, DataTypes);

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
  }

  type Query {
    authors: [Author]
    author(id: ID!): Author
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createAuthor(name: String!, biography: String, born_date: String): Author
    updateAuthor(id: ID!, name: String, biography: String, born_date: String): Author
    deleteAuthor(id: ID!): Boolean

    createBook(title: String!, description: String, published_date: String, author_id: ID!): Book
    updateBook(id: ID!, title: String, description: String, published_date: String): Book
    deleteBook(id: ID!): Boolean
  }
`;


const resolvers = {
  Query: {
    authors: async () => await Author.findAll(),
    author: async (parent, args) => await Author.findByPk(args.id),
    books: async () => await Book.findAll(),
    book: async (parent, args) => await Book.findByPk(args.id)
  },
  Mutation: {
    createAuthor: async (parent, args) => await Author.create(args),
    updateAuthor: async (parent, args) => {
      const author = await Author.findByPk(args.id);
      return await author.update(args);
    },
    deleteAuthor: async (parent, args) => {
      const author = await Author.findByPk(args.id);
      await author.destroy();
      return true;
    },
    createBook: async (parent, args) => await Book.create(args),
    updateBook: async (parent, args) => {
      const book = await Book.findByPk(args.id);
      return await book.update(args);
    },
    deleteBook: async (parent, args) => {
      const book = await Book.findByPk(args.id);
      await book.destroy();
      return true;
    }
  },
  Author: {
    books: async (author) => await Book.findAll({ where: { author_id: author.id } })
  },
  Book: {
    author: async (book) => await Author.findByPk(book.author_id)
  }
};

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
