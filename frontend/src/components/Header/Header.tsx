import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🔥</span>
          <span className="logo-text">GitHub Hotspot</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">热门仓库</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;