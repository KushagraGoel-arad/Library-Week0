import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import '../components/AuthorList.css'; 

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

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String, $born_date: String, $biography: String) {
    updateAuthor(id: $id, name: $name, born_date: $born_date, biography: $biography) {
      id
      name
      born_date
      biography
    }
  }
`;

const AuthorList = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [nameFilter, setNameFilter] = useState('');
  const [birthYearFilter, setBirthYearFilter] = useState('');
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null); 

  const { loading, error, data, refetch } = useQuery(GET_AUTHORS, {
    variables: { limit, offset, name: nameFilter, birthYear: birthYearFilter },
  });

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    update(cache, { data: { updateAuthor } }) {
      const { authors } = cache.readQuery({
        query: GET_AUTHORS,
        variables: { limit, offset, name: nameFilter, birthYear: birthYearFilter },
      });

      const updatedAuthors = authors.map(author => {
        if (author.id === updateAuthor.id) {
          return {
            ...author,
            name: updateAuthor.name,
            born_date: updateAuthor.born_date,
            biography: updateAuthor.biography,
          };
        }
        return author;
      });

      cache.writeQuery({
        query: GET_AUTHORS,
        variables: { limit, offset, name: nameFilter, birthYear: birthYearFilter },
        data: {
          authors: updatedAuthors,
        },
      });
    }
  });

  const handleEditAuthor = (authorId) => {
    setEditingAuthorId(authorId);
  };

  const handleUpdateAuthor = async (authorId, newName, newBornDate, newBiography) => {
    try {
      await updateAuthor({ variables: { id: authorId, name: newName, born_date: newBornDate, biography: newBiography } });
      setEditingAuthorId(null); 
    } catch (err) {
      console.error('Error updating author:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingAuthorId(null);
  };

  const handleFilterChange = () => {
    refetch({ limit, offset, name: nameFilter, birthYear: birthYearFilter });
  };

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
    refetch({ limit, offset: offset + limit, name: nameFilter, birthYear: birthYearFilter });
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
    refetch({ limit, offset: Math.max(offset - limit, 0), name: nameFilter, birthYear: birthYearFilter });
  };

  const handleAuthorClick = (author) => {
    setSelectedAuthor(author);
  };

  const handleBackToList = () => {
    setSelectedAuthor(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (selectedAuthor) {
    return (
      <div className="author-details">
        <button onClick={handleBackToList}>Back to List</button>
        <h2>{selectedAuthor.name}</h2>
        <p>Born on: {selectedAuthor.born_date}</p>
        <p>{selectedAuthor.biography}</p>
        {selectedAuthor.books && selectedAuthor.books.length > 0 && (
          <div>
            <h4>Books:</h4>
            {selectedAuthor.books.map(book => (
              <p key={book.id}>{book.title}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="author-list">
      <h1>Authors</h1>
      <div className="filters">
        <label>
          Name Filter:
          <input 
            type="text" 
            value={nameFilter} 
            onChange={(e) => setNameFilter(e.target.value)} 
          />
        </label>
        <label>
          Birth Year Filter:
          <input 
            type="text" 
            value={birthYearFilter} 
            onChange={(e) => setBirthYearFilter(e.target.value)} 
          />
        </label>
        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>
      <ul className="author-cards">
        {data.authors.map(author => (
          <li key={author.id} className="author-card">
            <div className="author-details">
              <div>
                <h2 onClick={() => handleAuthorClick(author)}>
                  {author.name}
                </h2>
                <p>Born on: {author.born_date}</p>
                <p>Biography: {author.biography}</p>
                {author.books && author.books.length > 0 && (
                  <div>
                    <h4>Books:</h4>
                    {author.books.map(book => (
                      <p key={book.id}>{book.title}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="edit-button">
                {editingAuthorId === author.id ? (
                  <EditAuthorForm 
                    author={author} 
                    onUpdateAuthor={handleUpdateAuthor} 
                    onCancelEdit={handleCancelEdit} 
                  />
                ) : (
                  
                  <button 
                    onClick={() => handleEditAuthor(author.id)} 
                    style={{ backgroundColor: 'coral' }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={offset === 0}>Previous</button>
        <button onClick={handleNextPage} disabled={data.authors.length < limit}>Next</button>
      </div>
    </div>
  );
};

const EditAuthorForm = ({ author, onUpdateAuthor, onCancelEdit }) => {
  const [name, setName] = useState(author.name);
  const [bornDate, setBornDate] = useState(author.born_date);
  const [biography, setBiography] = useState(author.biography);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAuthor(author.id, name, bornDate, biography);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-author-form">
      <label>
        Name:
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </label>
      <label>
        Born Date:
        <input 
          type="date" 
          value={bornDate} 
          onChange={(e) => setBornDate(e.target.value)} 
        />
      </label>
      <label>
        Biography:
        <textarea 
          value={biography} 
          onChange={(e) => setBiography(e.target.value)} 
        />
      </label>
      <div>
        <button type="submit">Update</button>
        <button type="button" onClick={onCancelEdit}>Cancel</button>
      </div>
    </form>
  );
};

export default AuthorList;
