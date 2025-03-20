import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FlashcardPage.css';
import Button from './Button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Flashcard {
  id: number;
  korean: string;
  english: string;
  sample_sentence: string;
}

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [displayedFlashcards, setDisplayedFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem('flashcardIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  const [flipped, setFlipped] = useState<boolean>(false);
  const [showSentence, setShowSentence] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(() => {
    return localStorage.getItem('flashcardShuffled') === 'true';
  });
  const [jumpToIndex, setJumpToIndex] = useState<string>('');

  useEffect(() => {
    if (!loading && flashcards.length > 0) {
      localStorage.setItem('flashcardIndex', currentIndex.toString());
      localStorage.setItem('flashcardShuffled', isShuffled.toString());
    }
  }, [currentIndex, isShuffled, loading, flashcards]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/korean/flashcards`, {
          timeout: 8000, // 8 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('No flashcard data received from the server');
        }
        
        setFlashcards(response.data);
        
        if (isShuffled) {
          const shuffled = [...response.data].sort(() => Math.random() - 0.5);
          setDisplayedFlashcards(shuffled);
        } else {
          setDisplayedFlashcards(response.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load flashcards. Please try again later.');
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleNext = () => {
    if (currentIndex < displayedFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
      setShowSentence(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
      setShowSentence(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const toggleSentence = () => {
    setShowSentence(!showSentence);
  };

  const shuffleCards = () => {
    if (isShuffled) {
      // Restore original order
      setDisplayedFlashcards([...flashcards]);
      setIsShuffled(false);
    } else {
      // Shuffle the cards using Fisher-Yates algorithm
      const shuffled = [...flashcards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDisplayedFlashcards(shuffled);
      setIsShuffled(true);
    }
    setCurrentIndex(0);
    setFlipped(false);
    setShowSentence(false);
  };

  const handleJumpToCard = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIndex = parseInt(jumpToIndex) - 1;
    
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= displayedFlashcards.length) {
      alert(`Please enter a number between 1 and ${displayedFlashcards.length}`);
      return;
    }
    
    setCurrentIndex(targetIndex);
    setFlipped(false);
    setShowSentence(false);
    setJumpToIndex('');
  };

  const parseSampleSentence = (sampleSentence: string) => {
    const parts = sampleSentence.split('/');
    return {
      korean: parts[0]?.trim() || '',
      english: parts[1]?.trim() || ''
    };
  };

  if (loading) return <div className="loading">Loading flashcards...</div>;
  if (error) return <div className="error">{error}</div>;
  if (displayedFlashcards.length === 0) return <div className="empty">No flashcards found.</div>;

  const currentCard = displayedFlashcards[currentIndex];
  const { korean: koreanSentence, english: englishSentence } = parseSampleSentence(currentCard.sample_sentence);

  return (
    <div className="flashcard-container">
      <h1>Korean Flashcards</h1>
      
      <div className="card-controls top-controls">
        <Button 
          variant={isShuffled ? "check" : "skip"} 
          onClick={shuffleCards}
        >
          {isShuffled ? "Unshuffle" : "Shuffle Cards"}
        </Button>
        
        {!isShuffled && (
          <form onSubmit={handleJumpToCard} className="jump-form">
            <input
              type="number"
              min="1"
              max={displayedFlashcards.length}
              value={jumpToIndex}
              onChange={(e) => setJumpToIndex(e.target.value)}
              placeholder={`Go to (1-${displayedFlashcards.length})`}
              className="jump-input"
            />
            <Button variant="hint" type="submit">Go</Button>
          </form>
        )}
      </div>
      
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="card-content">
              <span className="korean-text">{currentCard.korean}</span>
            </div>
          </div>
          <div className="flashcard-back">
            <div className="card-content">
              <span className="english-text">{currentCard.english}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-instructions">
        Click the card to flip
      </div>
      
      {showSentence && (
        <div className="sample-sentence">
          <div className="korean-sentence">{koreanSentence}</div>
          <div className="english-sentence">{englishSentence}</div>
        </div>
      )}
      
      <div className="flashcard-controls">
        <Button variant="back" onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </Button>
        
        <Button variant="hint" onClick={toggleSentence}>
          {showSentence ? 'Hide Example' : 'Show Example'}
        </Button>
        
        <Button variant="skip" onClick={handleNext} disabled={currentIndex === displayedFlashcards.length - 1}>
          Next
        </Button>
      </div>
      
      <div className="progress">
        {currentIndex + 1} of {displayedFlashcards.length}
      </div>
    </div>
  );
};

export default FlashcardPage; 