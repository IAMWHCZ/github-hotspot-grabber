import React, { useState, useEffect } from 'react';
import { FilterOptions, TimePeriod } from '../../types';
import { repositoryApi } from '../../services/api';
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
  const [languages, setLanguages] = useState<string[]>([]);

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
      case TimePeriod.Daily: return '今日';
      case TimePeriod.Weekly: return '本周';
      case TimePeriod.Monthly: return '本月';
      default: return '本周';
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>编程语言:</label>
        <select 
          value={filters.language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={loading}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>时间范围:</label>
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
        <label>显示数量:</label>
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
          className="btn btn-primary" 
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? '刷新中...' : '刷新数据'}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;