import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import FlashcardPage from './components/FlashcardPage';
import SentenceGamePage from './components/SentenceGamePage';
import SearchPage from './components/SearchPage';

function App() {
  // Initialize currentPage from localStorage or default to 'home'
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem('currentPage') || 'home';
  });

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage />;
      case 'flashcards':
        return <FlashcardPage />;
      case 'sentence-game':
        return <SentenceGamePage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
