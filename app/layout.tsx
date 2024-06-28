// app/layout.tsx
import { ReactNode } from 'react';
import '../app/globals.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html><body>
    <div className="app">
      <header className="header">
        <h1>CROSSWORD</h1>
      </header>
      <main className="container">{children}</main>
      <footer className="footer">
        <p>© 2024 My CROSSWORD</p>
      </footer>
    </div>
  </body></html>
);

export default Layout;
