import { useQuery, gql } from '@apollo/client';

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

const BookList = () => {
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { limit: 10, offset: 0 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.books.map(book => (
        <li key={book.id}>
          <h2>{book.title}</h2>
          <p>{book.description}</p>
          <p>Published on: {book.published_date}</p>
          <p>Author: {book.author ? book.author.name : 'Unknown'}</p>
          {book.reviews && book.reviews.length > 0 && (
            <div>
              <h4>Reviews:</h4>
              {book.reviews.map(review => (
                <p key={review.id}>{review.comment} - {review.rating} stars by {review.userId}</p>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BookList;
