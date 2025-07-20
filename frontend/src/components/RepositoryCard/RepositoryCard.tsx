import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repository } from '../../types';
import './RepositoryCard.css';

interface RepositoryCardProps {
  repository: Repository;
  rank: number;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, rank }) => {
  const { t, i18n } = useTranslation();
  
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const locale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 20) return '#28a745';
    if (score >= 15) return '#ffc107';
    if (score >= 10) return '#fd7e14';
    return '#6c757d';
  };

  return (
    <div className="repository-card">
      <div className="card-header">
        <div className="rank-badge">#{rank}</div>
        <div className="score-badge" style={{ backgroundColor: getScoreColor(repository.hotspotScore) }}>
          {repository.hotspotScore.toFixed(1)}
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="repo-name">
          <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer">
            {repository.fullName}
          </a>
        </h3>
        
        <p className="repo-description">
          {repository.description || t('repository.noDescription')}
        </p>
        
        <div className="repo-stats">
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{formatNumber(repository.stars)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🍴</span>
            <span className="stat-value">{formatNumber(repository.forks)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🐛</span>
            <span className="stat-value">{repository.openIssues}</span>
          </div>
        </div>
        
        <div className="repo-meta">
          {repository.language && (
            <span className="language-tag">{repository.language}</span>
          )}
          <span className="update-date">
            {t('repository.updatedAt')}: {formatDate(repository.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;