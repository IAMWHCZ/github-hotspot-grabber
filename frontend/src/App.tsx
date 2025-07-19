import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import RepositoryPage from './pages/RepositoryPage/RepositoryPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repository/:owner/:name" element={<RepositoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;