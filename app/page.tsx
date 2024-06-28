
import Link from 'next/link';
import React from 'react';
import styles from './page.module.css';
const HomePage: React.FC = () => (
 
  <div className={styles.pageContainer}>
  <h1 className={styles.heading}>Library Collection</h1>
  <nav>
    <ul className={styles.navList}>
      <li className={styles.navItem}>
        <Link legacyBehavior href="/authors">
          <a className={styles.navLink}>Authors</a>
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link legacyBehavior href="/books">
          <a className={styles.navLink}>Books</a>
        </Link>
      </li>
    </ul>
  </nav>
</div>

);

export default HomePage;
