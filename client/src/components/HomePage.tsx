import React from 'react';
import './HomePage.css';
import Button from './Button';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Korean Learning App</h1>
        <p>Practice Korean with our interactive tools</p>
      </header>
      
      <div className="features-grid">
        <div className="feature-card">
          <h2>Flashcards</h2>
          <p>Review Korean vocabulary with interactive flashcards</p>
          <Button variant="skip" onClick={() => onNavigate('flashcards')}>
            Practice Now
          </Button>
        </div>
        
        <div className="feature-card">
          <h2>Sentence Game</h2>
          <p>Test your knowledge by building Korean sentences</p>
          <Button variant="check" onClick={() => onNavigate('sentence-game')}>
            Play Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 