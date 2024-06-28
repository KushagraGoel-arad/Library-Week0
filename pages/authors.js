// pages/authors.js
import AuthorList from '../components/AuthorList';
import AuthorForm from '../components/AuthorForm';

const AuthorsPage = () => (
  <div>
    <h1>Authors</h1>
    <AuthorForm onCompleted={() => window.location.reload()} /> {/* Refresh list after author operations */}
    <AuthorList />
  </div>
);

export default AuthorsPage;
