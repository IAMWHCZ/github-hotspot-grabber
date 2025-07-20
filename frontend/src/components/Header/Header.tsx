import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import './Header.css';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🔥</span>
          <span className="logo-text">{t('header.title')}</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">{t('navigation.trending')}</Link>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;