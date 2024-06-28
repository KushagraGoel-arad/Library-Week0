// pages/authors.js

import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import AuthorForm from '../components/AuthorForm';

const GET_AUTHORS = gql`
  query GetAuthors($limit: Int, $offset: Int, $name: String, $birthYear: String) {
    authors(limit: $limit, offset: $offset, name: $name, birthYear: $birthYear) {
      id
      name
      biography
      born_date
      books {
        id
        title
      }
    }
  }
`;

const AuthorList = () => {
  const { loading, error, data } = useQuery(GET_AUTHORS, {
    variables: { limit: 10, offset: 0 },
  });

  const router = useRouter();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleEditAuthor = (authorId) => {
    
    
    router.push(`/author/${authorId}`);
  };

  return (
    <div>
      <h1>Authors</h1>
      <ul>
        {data.authors.map(author => (
          <li key={author.id}>
            <h2>{author.name}</h2>
            <p>{author.biography}</p>
            <p>Born on: {author.born_date}</p>
            {author.books && author.books.length > 0 && (
              <div>
                <h4>Books:</h4>
                {author.books.map(book => (
                  <p key={book.id}>{book.title}</p>
                ))}
              </div>
            )}
            <button onClick={() => handleEditAuthor(author.id)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
