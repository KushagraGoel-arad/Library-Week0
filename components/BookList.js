import { useQuery, useMutation, gql } from '@apollo/client';
import { useState, useRef } from 'react';
import BookForm from './BookForm';
import StarRating from '../components/StarRating';
import { getUserIdFromToken } from '../utilities/auth';

const GET_BOOKS = gql`
  query GetBooks($limit: Int, $offset: Int, $title: String, $author: String, $publishDate: String) {
    books(limit: $limit, offset: $offset, title: $title, author: $author, publishDate: $publishDate) {
      id
      title
      description
      published_date
      author {
        id
        name
      }
      reviews {
        id
        rating
        comment
        userId
        createdAt
      }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $description: String, $published_date: String!, $authorId: ID!) {
    createBook(title: $title, description: $description, published_date: $published_date, authorId: $authorId) {
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

const CREATE_REVIEW = gql`
  mutation CreateReview($bookId: ID!, $rating: Int!, $comment: String!, $userId: String!) {
    createReview(bookId: $bookId, rating: $rating, comment: $comment, userId: $userId) {
      id
      rating
      comment
      userId
      createdAt
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $rating: Int!, $comment: String!) {
    updateReview(id: $id, rating: $rating, comment: $comment) {
      id
      rating
      comment
      userId
      createdAt
    }
  }
`;

const styles = {
  listContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  bookItem: {
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookDetails: {
    flexGrow: 1,
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    alignSelf: 'flex-end',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  bookAuthor: {
    fontSize: '16px',
    color: '#555',
  },
  bookDate: {
    fontSize: '14px',
    color: '#777',
  },
  editButton: {
    padding: '8px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  editButtonHover: {
    backgroundColor: '#0056b3',
  },
  deleteButton: {
    padding: '8px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#dc3545',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  deleteButtonHover: {
    backgroundColor: '#c82333',
  },
  addButton: {
    display: 'block',
    margin: '0 auto',
    padding: '12px 25px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease',
  },
  addButtonHover: {
    backgroundColor: '#218838',
  },
};

const style = {
  listContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '8px',
    fontSize: '14px',
  },
};

const BookList = () => {
  const bookFormRef = useRef(null);
  const [filters, setFilters] = useState({ title: '', author: '', publishDate: '' });
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_BOOKS, {
    variables: { limit, offset, ...filters },
    fetchPolicy: 'cache-and-network'
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBookId, setEditingBookId] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState({});
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => refetch(),
  });

  const books = data?.books || [];

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
    fetchMore({
      variables: { offset: offset + limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          books: [...prev.books, ...fetchMoreResult.books],
        };
      },
    });
  };

  const [createBook] = useMutation(CREATE_BOOK, {
    onCompleted: () => refetch(),
  });

  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: (data) => {
      console.log('Review created:', data);
      refetch();
    },
    onError: (error) => {
      console.error('Error creating review:', error.message);
      if (error.networkError) {
        console.error('Network error:', error.networkError.result.errors);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
    }
  });

  const [updateReview] = useMutation(UPDATE_REVIEW, {
    onCompleted: () => refetch(),
  });

  const handleCreateReview = async (bookId, rating, comment) => {
    const userId = getUserIdFromToken();
    console.log('User ID:', userId);
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    console.log('Creating review with variables:', { bookId, rating, comment, userId });
    try {
      const response = await createReview({
        variables: { bookId, rating, comment, userId },
      });
      console.log('Create review response:', response);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleAddClick = () => {
    setSelectedBook(null);
    setEditingBookId(null);
  };

  const handleUpdateReview = async (reviewId, rating, comment) => {
    try {
      console.log('Updating review:', reviewId, rating, comment);
      const response = await updateReview({
        variables: { id: reviewId, rating, comment },
      });
      console.log('Update response:', response);
      refetch();
    } catch (err) {
      console.error('Error updating review:', err);
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setSelectedBook(book);
    if (bookFormRef.current) {
      bookFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({ variables: { id: bookId } });
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const handleFormCompleted = () => {
    setSelectedBook(null);
    setEditingBookId(null);
    refetch();
  };

  const toggleDescription = (id) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setOffset(0);
    refetch({ limit, offset: 0, ...filters });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={styles.listContainer}>
      <center><h1>Books</h1></center>
      
      <center>
      <form onSubmit={handleFilterSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          value={filters.title}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          name="author"
          placeholder="Filter by author"
          value={filters.author}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <input
          type="date"
          name="publishDate"
          placeholder="Filter by publish date"
          value={filters.publishDate}
          onChange={handleFilterChange}
          style={{ marginRight: '10px' }}
        />
        <p></p>
        <button type="submit" style={styles.addButton}>Apply Filters</button>
      </form>
      </center>
      


      {(editingBookId !== null || selectedBook === null) && (
        <div ref={bookFormRef}>
        <BookForm book={selectedBook} onCompleted={handleFormCompleted} />
      </div>
        
      )}

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} style={styles.bookItem}>
            <div style={styles.bookDetails}>
              <h2 style={styles.bookTitle}>{book.title}</h2>
              <a
                style={style.link}
                onClick={() => toggleDescription(book.id)}
              >
                {showDescriptions[book.id] ? 'Hide' : 'Show'} Description
              </a>
              {showDescriptions[book.id] && book.description && (
                <p style={styles.bookDescription}>Description: {book.description}</p>
              )}
              <p style={styles.bookDate}>Published on: {book.published_date}</p>
              <p style={styles.bookAuthor}>Author: {book.author ? book.author.name : 'Unknown'}</p>
              {book.reviews && book.reviews.length > 0 && (
                <div style={styles.reviewContainer}>
                  <h4>Reviews:</h4>
                  {book.reviews.map((review) => (
                    <div key={review.id} style={styles.reviewItem}>
                      <p style={styles.reviewRating}>Rating: {review.rating}</p>
                      <p style={styles.reviewComment}>Comment: {review.comment}</p>
                      <p style={styles.reviewUser}>User: {review.userId}</p>
                      <button onClick={() => handleUpdateReview(review.id, review.rating, review.comment)}>
                        Edit Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <StarRating bookId={book.id} onSubmit={handleCreateReview} />
            </div>
            <div style={styles.buttonGroup}>
              <button
                style={{
                  ...styles.editButton,
                  ...(isButtonHovered ? styles.editButtonHover : {}),
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                onClick={() => handleEditBook(book)}
              >
                Edit
              </button>
              <button
                style={{
                  ...styles.deleteButton,
                  ...(isButtonHovered ? styles.deleteButtonHover : {}),
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default BookList;
