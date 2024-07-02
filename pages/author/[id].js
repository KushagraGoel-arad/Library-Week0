import { useRouter } from 'next/router';
import AuthorForm from '../../components/AuthorForm';

const AuthorPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return <p>Loading...</p>;

  return <AuthorForm authorId={id} />;
};

export default AuthorPage;
