// components/BookForm.js
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK, UPDATE_BOOK } from '../graphql/queries';

const BookForm = ({ book = {}, onCompleted }) => {
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');

  const [createBook] = useMutation(CREATE_BOOK, { onCompleted });
  const [updateBook] = useMutation(UPDATE_BOOK, { onCompleted });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (book.id) {
      updateBook({ variables: { id: book.id, title, author } });
    } else {
      createBook({ variables: { title, author } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Author:</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <button type="submit">{book.id ? 'Update' : 'Create'} Book</button>
    </form>
  );
};

export default BookForm;
