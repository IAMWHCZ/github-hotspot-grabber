import React, { useState, useEffect } from 'react';
import { Repository, TimePeriod, FilterOptions } from '../../types';
import { repositoryApi } from '../../services/api';
import RepositoryList from '../../components/RepositoryList/RepositoryList';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    language: 'All Languages',
    timePeriod: TimePeriod.Weekly,
    limit: 50
  });

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const request = {
        language: filters.language === 'All Languages' ? undefined : filters.language,
        timePeriod: filters.timePeriod,
        limit: filters.limit,
        page: 1
      };

      const response = await repositoryApi.getTrending(request);
      setRepositories(response.repositories);
    } catch (err) {
      setError('获取数据失败，请稍后重试');
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleRefresh = async () => {
    await fetchRepositories();
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>🔥 GitHub 热门仓库</h1>
        <p>发现最新最热门的开源项目</p>
      </div>

      <FilterPanel 
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          正在加载热门仓库...
        </div>
      ) : (
        <RepositoryList repositories={repositories} />
      )}
    </div>
  );
};

export default HomePage;