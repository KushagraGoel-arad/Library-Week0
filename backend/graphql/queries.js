import { gql } from '@apollo/client';



export const GET_AUTHOR = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

export const GET_BOOKS = gql`
  query GetBooks($limit: Int, $offset: Int, $title: String, $author: String) {
    books(limit: $limit, offset: $offset, title: $title, author: $author) {
      id
      title
      author {
        id
        name
      }
    }
  }
`;


export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $biography: String, $born_date: String) {
    createAuthor(name: $name, biography: $biography, born_date: $born_date) {
      id
      name
      biography
      born_date
    }
  }
`;
export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $authorId: ID!) {
    createBook(title: $title, authorId: $authorId) {
      id
      title
      author {
        id
        name
      }
    }
  }
`;
export const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String!, $biography: String, $born_date: String) {
    updateAuthor(id: $id, name: $name, biography: $biography, born_date: $born_date) {
      id
      name
      biography
      born_date
    }
  }
`;
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String!, $authorId: ID!) {
    updateBook(id: $id, title: $title, authorId: $authorId) {
      id
      title
      author {
        id
        name
      }
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;