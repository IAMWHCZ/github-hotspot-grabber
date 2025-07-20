import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastContext } from '../../contexts/ToastContext';
import './WeightConfig.css';

interface WeightConfigData {
  stars: number;
  forks: number;
  issues: number;
  freshness: number;
  activity: number;
}

interface WeightConfigProps {
  onWeightChange?: (weights: WeightConfigData) => void;
  onClose?: () => void;
}

const WeightConfig: React.FC<WeightConfigProps> = ({ onWeightChange, onClose }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToastContext();
  const [weights, setWeights] = useState<WeightConfigData>({
    stars: 0.35,
    forks: 0.25,
    issues: 0.15,
    freshness: 0.15,
    activity: 0.10
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentWeights();
  }, []);

  const fetchCurrentWeights = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/repositories/weights');
      if (response.ok) {
        const data = await response.json();
        setWeights(data);
      }
    } catch (error) {
      console.error('Error fetching weights:', error);
    }
  };

  const handleWeightChange = (key: keyof WeightConfigData, value: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const normalizeWeights = () => {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (total > 0) {
      const normalized = Object.entries(weights).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value / total
      }), {} as WeightConfigData);
      setWeights(normalized);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/repositories/weights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weights),
      });

      if (response.ok) {
        const result = await response.json();
        setWeights(result.weights);
        onWeightChange?.(result.weights);
        showSuccess(t('weights.weightsUpdated'));
      } else {
        showError(t('weights.updateError'));
      }
    } catch (error) {
      console.error('Error updating weights:', error);
      showError(t('messages.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWeights({
      stars: 0.35,
      forks: 0.25,
      issues: 0.15,
      freshness: 0.15,
      activity: 0.10
    });
  };

  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidTotal = Math.abs(total - 1.0) < 0.01;

  return (
    <div className="weight-config-overlay">
      <div className="weight-config-modal">
        <div className="modal-header">
          <h3>{t('weights.title')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <p className="description">{t('weights.description')}</p>
          
          <div className="weight-controls">
            <div className="weight-item">
              <label>{t('weights.stars')}</label>
              <div className="weight-input-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.stars}
                  onChange={(e) => handleWeightChange('stars', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.stars.toFixed(2)}
                  onChange={(e) => handleWeightChange('stars', parseFloat(e.target.value) || 0)}
                  className="weight-number-input"
                />
              </div>
            </div>

            <div className="weight-item">
              <label>{t('weights.forks')}</label>
              <div className="weight-input-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.forks}
                  onChange={(e) => handleWeightChange('forks', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.forks.toFixed(2)}
                  onChange={(e) => handleWeightChange('forks', parseFloat(e.target.value) || 0)}
                  className="weight-number-input"
                />
              </div>
            </div>

            <div className="weight-item">
              <label>{t('weights.issues')}</label>
              <div className="weight-input-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.issues}
                  onChange={(e) => handleWeightChange('issues', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.issues.toFixed(2)}
                  onChange={(e) => handleWeightChange('issues', parseFloat(e.target.value) || 0)}
                  className="weight-number-input"
                />
              </div>
            </div>

            <div className="weight-item">
              <label>{t('weights.freshness')}</label>
              <div className="weight-input-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.freshness}
                  onChange={(e) => handleWeightChange('freshness', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.freshness.toFixed(2)}
                  onChange={(e) => handleWeightChange('freshness', parseFloat(e.target.value) || 0)}
                  className="weight-number-input"
                />
              </div>
            </div>

            <div className="weight-item">
              <label>{t('weights.activity')}</label>
              <div className="weight-input-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.activity}
                  onChange={(e) => handleWeightChange('activity', parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={weights.activity.toFixed(2)}
                  onChange={(e) => handleWeightChange('activity', parseFloat(e.target.value) || 0)}
                  className="weight-number-input"
                />
              </div>
            </div>
          </div>

          <div className="weight-summary">
            <div className={`total-weight ${isValidTotal ? 'valid' : 'invalid'}`}>
              {t('weights.total')}: {total.toFixed(2)}
              {!isValidTotal && <span className="warning"> ⚠️ {t('weights.shouldBeOne')}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="btn btn-secondary" 
              onClick={normalizeWeights}
              disabled={loading}
            >
              {t('weights.normalize')}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleReset}
              disabled={loading}
            >
              {t('weights.reset')}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? t('common.loading') : t('weights.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightConfig;