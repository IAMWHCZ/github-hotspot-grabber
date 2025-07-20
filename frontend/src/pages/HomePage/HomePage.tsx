import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Repository, TimePeriod, FilterOptions } from "../../types";
import { repositoryApi } from "../../services/api";
import "./HomePage.css";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import RepositoryList from "../../components/RepositoryList/RepositoryList";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    language: "All Languages",
    timePeriod: TimePeriod.Weekly,
    limit: 50,
  });

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      const request = {
        language:
          filters.language === "All Languages" ? undefined : filters.language,
        timePeriod: filters.timePeriod,
        limit: filters.limit,
        page: 1,
      };

      const response = await repositoryApi.getTrending(request);
      setRepositories(response.repositories);
    } catch (err) {
      setError(t('messages.fetchError'));
      console.error("Error fetching repositories:", err);
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
        <h1>🔥 {t('header.title')}</h1>
        <p>{t('header.subtitle')}</p>
      </div>
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <RepositoryList repositories={repositories} />
      )}
    </div>
  );
};

export default HomePage;
