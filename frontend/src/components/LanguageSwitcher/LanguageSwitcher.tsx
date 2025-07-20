import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label={t('language.switch')}
      >
        <option value="en">{t('language.english')}</option>
        <option value="zh">{t('language.chinese')}</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;