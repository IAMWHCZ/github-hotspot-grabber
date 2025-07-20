import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import RepositoryPage from './pages/RepositoryPage/RepositoryPage';
import ToastContainer from './components/Toast/ToastContainer';
import { useToast } from './hooks/useToast';
import { ToastContext } from './contexts/ToastContext';

const App: React.FC = () => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/repository/:owner/:name" element={<RepositoryPage />} />
            </Routes>
          </main>
          <ToastContainer toasts={toast.toasts} onRemoveToast={toast.removeToast} />
        </div>
      </Router>
    </ToastContext.Provider>
  );
};

export default App;