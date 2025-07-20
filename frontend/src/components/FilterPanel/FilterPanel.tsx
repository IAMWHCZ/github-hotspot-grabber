import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterOptions, TimePeriod } from '../../types';
import { repositoryApi } from '../../services/api';
import WeightConfig from '../WeightConfig/WeightConfig';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  loading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  loading 
}) => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<string[]>([]);
  const [showWeightConfig, setShowWeightConfig] = useState(false);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await repositoryApi.getLanguages();
        setLanguages(langs);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleLanguageChange = (language: string) => {
    onFilterChange({ ...filters, language });
  };

  const handleTimePeriodChange = (timePeriod: TimePeriod) => {
    onFilterChange({ ...filters, timePeriod });
  };

  const handleLimitChange = (limit: number) => {
    onFilterChange({ ...filters, limit });
  };

  const getTimePeriodText = (period: TimePeriod): string => {
    switch (period) {
      case TimePeriod.Daily: return t('filters.daily');
      case TimePeriod.Weekly: return t('filters.weekly');
      case TimePeriod.Monthly: return t('filters.monthly');
      default: return t('filters.weekly');
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>{t('filters.language')}:</label>
        <select 
          value={filters.language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={loading}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>
              {lang === 'All Languages' ? t('filters.allLanguages') : lang}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>{t('filters.timePeriod')}:</label>
        <div className="time-period-buttons">
          {[TimePeriod.Daily, TimePeriod.Weekly, TimePeriod.Monthly].map(period => (
            <button
              key={period}
              className={`time-btn ${filters.timePeriod === period ? 'active' : ''}`}
              onClick={() => handleTimePeriodChange(period)}
              disabled={loading}
            >
              {getTimePeriodText(period)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>{t('common.results')}:</label>
        <select 
          value={filters.limit} 
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          disabled={loading}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="filter-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowWeightConfig(true)}
          disabled={loading}
        >
          ⚙️ {t('weights.configure')}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.refresh')}
        </button>
      </div>

      {showWeightConfig && (
        <WeightConfig
          onWeightChange={() => {
            // 权重更新后可以触发数据刷新
            onRefresh();
          }}
          onClose={() => setShowWeightConfig(false)}
        />
      )}
    </div>
  );
};

export default FilterPanel;