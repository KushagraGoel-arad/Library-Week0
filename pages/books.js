
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';

const BooksPage = () => (
  <div>
    <h1>Books</h1>
    <BookForm onCompleted={() => window.location.reload()} /> 
    <BookList />
  </div>
);

export default BooksPage;
