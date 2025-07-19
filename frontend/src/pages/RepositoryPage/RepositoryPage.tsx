import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Repository } from '../../types';
import { repositoryApi } from '../../services/api';
import './RepositoryPage.css';

const RepositoryPage: React.FC = () => {
  const { owner, name } = useParams<{ owner: string; name: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepository = async () => {
      if (!owner || !name) return;
      
      try {
        setLoading(true);
        setError(null);
        const repo = await repositoryApi.getRepository(owner, name);
        setRepository(repo);
      } catch (err) {
        setError('获取仓库信息失败');
        console.error('Error fetching repository:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepository();
  }, [owner, name]);

  if (loading) {
    return <div className="loading">正在加载仓库信息...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error">{error}</div>
        <Link to="/" className="btn btn-primary">返回首页</Link>
      </div>
    );
  }

  if (!repository) {
    return (
      <div className="error-page">
        <div className="error">仓库不存在</div>
        <Link to="/" className="btn btn-primary">返回首页</Link>
      </div>
    );
  }

  return (
    <div className="repository-page">
      <div className="breadcrumb">
        <Link to="/">首页</Link> / <span>{repository.fullName}</span>
      </div>
      
      <div className="repo-header">
        <h1>{repository.fullName}</h1>
        <p>{repository.description}</p>
        <div className="repo-links">
          <a href={repository.htmlUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            在 GitHub 上查看
          </a>
        </div>
      </div>

      <div className="repo-details">
        <div className="detail-card">
          <h3>统计信息</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Stars</span>
              <span className="stat-value">{repository.stars}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Forks</span>
              <span className="stat-value">{repository.forks}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Issues</span>
              <span className="stat-value">{repository.openIssues}</span>
            </div>
            <div className="stat">
              <span className="stat-label">热度分数</span>
              <span className="stat-value">{repository.hotspotScore.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>项目信息</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">语言:</span>
              <span className="info-value">{repository.language || '未知'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">创建时间:</span>
              <span className="info-value">{new Date(repository.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">最后更新:</span>
              <span className="info-value">{new Date(repository.updatedAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="info-item">
              <span className="info-label">最后推送:</span>
              <span className="info-value">{new Date(repository.pushedAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryPage;