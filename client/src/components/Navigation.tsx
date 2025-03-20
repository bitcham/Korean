import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="nav-container">
      <div className="nav-inner">
        <div className="logo">
          <h1>KoreanLearner</h1>
        </div>
        
        <ul className="nav-links">
          <li 
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => onNavigate('home')}
          >
            Home
          </li>
          <li 
            className={currentPage === 'search' ? 'active' : ''}
            onClick={() => onNavigate('search')}
          >
            Search
          </li>
          <li 
            className={currentPage === 'flashcards' ? 'active' : ''}
            onClick={() => onNavigate('flashcards')}
          >
            Flashcards
          </li>
          <li 
            className={currentPage === 'sentence-game' ? 'active' : ''}
            onClick={() => onNavigate('sentence-game')}
          >
            Sentence Game
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 