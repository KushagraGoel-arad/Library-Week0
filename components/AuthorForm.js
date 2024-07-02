// AuthorForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_AUTHOR = gql`
  query GetAuthor($id: ID!) {
    author(id: $id) {
      id
      name
      biography
      born_date
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!, $biography: String, $born_date: String) {
    createAuthor(name: $name, biography: $biography, born_date: $born_date) {
      id
      name
      biography
      born_date
    }
  }
`;

const UPDATE_AUTHOR = gql`
  mutation UpdateAuthor($id: ID!, $name: String!, $biography: String, $born_date: String) {
    updateAuthor(id: $id, name: $name, biography: $biography, born_date: $born_date) {
      id
      name
      biography
      born_date
    }
  }
`;

const AuthorForm = ({ authorId }) => {
  const router = useRouter();
  const isNewAuthor = authorId === 'new';
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [bornDate, setBornDate] = useState('');

  const { loading, error, data } = useQuery(GET_AUTHOR, {
    variables: { id: authorId },
    skip: isNewAuthor,
  });

  useEffect(() => {
    if (!isNewAuthor && data && data.author) {
      const { name, biography, born_date } = data.author;
      setName(name);
      setBiography(biography || '');
      setBornDate(born_date || '');
    }
  }, [data, isNewAuthor]);

  const [createAuthor] = useMutation(CREATE_AUTHOR, {
    onCompleted: () => router.push('/authors'),
  });

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    onCompleted: () => router.push('/authors'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authorData = { name, biography, born_date: bornDate };
    if (isNewAuthor) {
      await createAuthor({ variables: authorData });
    } else {
      await updateAuthor({ variables: { id: authorId, ...authorData } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Biography:</label>
        <textarea value={biography} onChange={(e) => setBiography(e.target.value)} />
      </div>
      <div>
        <label>Born Date:</label>
        <input type="text" value={bornDate} onChange={(e) => setBornDate(e.target.value)} />
      </div>
      <button type="submit">{isNewAuthor ? 'Create' : 'Update'} Author</button>
    </form>
  );
};

export default AuthorForm;
