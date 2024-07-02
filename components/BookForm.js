import React, { useState, useEffect } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';

const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
      description
      published_date
      author {
        id
        name
      }
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($input: UpdateBookInput!) {
    updateBook(input: $input) {
      id
      title
      description
      published_date
      author {
        id
        name
      }
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(name: $name) {
      id
      name
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
    }
  }
`;

const styles = {
  formContainer: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#6b8bae',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: '#555',
  },
  formButton: {
    display: 'block',
    marginTop: '20px',
    padding: '12px 25px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  formButtonHover: {
    backgroundColor: '#218838',
  },
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const BookForm = ({ book, onCompleted }) => {
  const [formState, setFormState] = useState({
    title: book ? book.title : '',
    description: book ? book.description : '',
    published_date: book ? formatDate(book.published_date) : '',
    authorId: book ? book.author.id : '',
    newAuthorName: '',
    useExistingAuthor: true,
  });

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const { data: authorsData, loading: authorsLoading, error: authorsError } = useQuery(GET_AUTHORS);

  useEffect(() => {
    if (book) {
      setFormState({
        title: book.title,
        description: book.description,
        published_date: formatDate(book.published_date),
        authorId: book.author ? book.author.id : '',
        newAuthorName: '',
        useExistingAuthor: true,
      });
    }
  }, [book]);

  const [createBook] = useMutation(CREATE_BOOK, {
    onCompleted,
  });

  const [updateBook] = useMutation(UPDATE_BOOK, {
    onCompleted,
  });

  const [createAuthor] = useMutation(CREATE_AUTHOR);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const input = {
      title: formState.title,
      description: formState.description,
      published_date: formState.published_date,
      authorId: formState.authorId,
    };

    if (formState.useExistingAuthor) {
      input.authorId = formState.authorId;
    } else {
     
      const { data } = await createAuthor({
        variables: {
          name: formState.newAuthorName,
        },
      });

      input.authorId = data.createAuthor.id;
    }

    if (book) {
      const updateInput = {
        id: book.id,
        title: formState.title,
        description: formState.description,
        published_date: formState.published_date,
        authorId: input.authorId,
      };

      updateBook({
        variables: {
          input: updateInput,
        },
      });
    } else {
      createBook({
        variables: {
          input,
        },
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAuthorToggle = (useExistingAuthor) => {
    setFormState({
      ...formState,
      useExistingAuthor,
    });
  };

  if (authorsLoading) return <p>Loading authors...</p>;
  if (authorsError) return <p>Error loading authors: {authorsError.message}</p>;

  const authors = authorsData ? authorsData.authors : [];

  return (
    <form style={styles.formContainer} onSubmit={handleSubmit}>
      <div style={styles.formGroup}>
        <label style={styles.formLabel} htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          style={styles.formInput}
          value={formState.title}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.formLabel} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          style={styles.formInput}
          value={formState.description}
          onChange={handleChange}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.formLabel} htmlFor="published_date">Published Date</label>
        <input
          type="date"
          id="published_date"
          name="published_date"
          style={styles.formInput}
          value={formState.published_date}
          onChange={handleChange}
          required
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Author</label>
        <div>
          <input
            type="radio"
            id="existingAuthor"
            name="authorOption"
            value="existing"
            checked={formState.useExistingAuthor}
            onChange={() => handleAuthorToggle(true)}
          />
          <label htmlFor="existingAuthor">Select Existing Author</label>
        </div>
        <div>
          <input
            type="radio"
            id="newAuthor"
            name="authorOption"
            value="new"
            checked={!formState.useExistingAuthor}
            onChange={() => handleAuthorToggle(false)}
          />
          <label htmlFor="newAuthor">Create New Author</label>
        </div>
      </div>
      {formState.useExistingAuthor ? (
        <div style={styles.formGroup}>
          <label style={styles.formLabel} htmlFor="authorId">Existing Author</label>
          <select
            id="authorId"
            name="authorId"
            style={styles.formInput}
            value={formState.authorId}
            onChange={handleChange}
            required
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={styles.formGroup}>
          <label style={styles.formLabel} htmlFor="newAuthorName">New Author Name</label>
          <input
            type="text"
            id="newAuthorName"
            name="newAuthorName"
            style={styles.formInput}
            value={formState.newAuthorName}
            onChange={handleChange}
            required
          />
        </div>
      )}
      <button
        type="submit"
        style={{
          ...styles.formButton,
          ...(isButtonHovered ? styles.formButtonHover : {}),
        }}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        {book ? 'Update Book' : 'Create Book'}
      </button>
    </form>
  );
};

export default BookForm;
