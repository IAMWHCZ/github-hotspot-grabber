import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repository } from '../../types';
import RepositoryCard from '../RepositoryCard/RepositoryCard';
import './RepositoryList.css';

interface RepositoryListProps {
  repositories: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  const { t } = useTranslation();
  
  if (repositories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>{t('common.noResults')}</h3>
        <p>{t('messages.noRepositories')}</p>
      </div>
    );
  }

  return (
    <div className="repository-list">
      <div className="list-header">
        <h2>{t('common.total')} {repositories.length} {t('common.results')}</h2>
      </div>
      <div className="repository-grid">
        {repositories.map((repo, index) => (
          <RepositoryCard 
            key={repo.gitHubId} 
            repository={repo} 
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default RepositoryList;