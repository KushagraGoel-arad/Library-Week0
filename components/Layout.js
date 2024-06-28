import React, { useState } from 'react';
import Head from 'next/head'; // For setting head tags like title, meta, etc.
import Link from 'next/link';
import styles from './Layout.module.css'; // Import CSS module for styling
import BookList from './BookList'; // Import BookList component
import AuthorList from './AuthorList'; // Import AuthorList component

const Layout = () => {
  const [showBooks, setShowBooks] = useState(false);
  const [showAuthors, setShowAuthors] = useState(false);

  const handleShowBooks = () => {
    setShowBooks(true);
    setShowAuthors(false);
  };

  const handleShowAuthors = () => {
    setShowAuthors(true);
    setShowBooks(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Library Collection</title>
        <meta name="description" content="Explore books and authors in our library." />
      </Head>
      <header className={styles.header}>
        <h1 className={styles.title}>Library Collection</h1>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="#" legacyBehavior>
                <a className={styles.navLink} onClick={handleShowAuthors}>Authors</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#" legacyBehavior>
                <a className={styles.navLink} onClick={handleShowBooks}>Books</a>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.main}>
        {showBooks && <BookList />}
        {showAuthors && <AuthorList />}
        {!showBooks && !showAuthors && <p>Please select Books or Authors</p>}
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} My Library</p>
      </footer>
    </div>
  );
}

export default Layout;
