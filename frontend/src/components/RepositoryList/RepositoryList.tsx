import React from 'react';
import { Repository } from '../../types';
import RepositoryCard from '../RepositoryCard/RepositoryCard';
import './RepositoryList.css';

interface RepositoryListProps {
  repositories: Repository[];
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  if (repositories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>暂无数据</h3>
        <p>没有找到符合条件的仓库，请尝试调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="repository-list">
      <div className="list-header">
        <h2>共找到 {repositories.length} 个热门仓库</h2>
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