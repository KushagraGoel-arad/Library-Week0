// pages/author/[id].js

import { useRouter } from 'next/router';
import AuthorForm from '../../components/AuthorForm';

const AuthorPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <AuthorForm authorId={id} />;
};

export default AuthorPage;

