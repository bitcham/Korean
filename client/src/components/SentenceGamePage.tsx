import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SentenceGamePage.css';
import Button from './Button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


interface SentenceGameItem {
  id: number;
  word: string;
  meaning: string;
  sentence: string;
  translation: string;
  sentenceParts: string[];
}

const SentenceGamePage: React.FC = () => {
  const [allGameData, setAllGameData] = useState<SentenceGameItem[]>([]);
  const [gameData, setGameData] = useState<SentenceGameItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  
  // Initialize from localStorage or default values
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const savedIndex = localStorage.getItem('sentenceGameIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  
  const [isShuffled, setIsShuffled] = useState<boolean>(() => {
    return localStorage.getItem('sentenceGameShuffled') === 'true';
  });
  
  const [shuffledParts, setShuffledParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [jumpToIndex, setJumpToIndex] = useState<string>('');


  // Save state to localStorage when it changes
  useEffect(() => {
    if (!loading && gameData.length > 0) {
      localStorage.setItem('sentenceGameIndex', currentIndex.toString());
      localStorage.setItem('sentenceGameShuffled', isShuffled.toString());
    }
  }, [currentIndex, isShuffled, loading, gameData]);

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_BASE_URL}/korean/sentence-game`, {
          timeout: 8000, // 8 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
          throw new Error('No valid data received from the server');
        }
        
        setAllGameData(response.data);
        
        let dataToUse = response.data;
        if (isShuffled) {
          dataToUse = [...response.data].sort(() => Math.random() - 0.5);
        }
        
        setGameData(dataToUse);
        setLoading(false);
        
        // Initialize with the saved or first sentence
        if (dataToUse.length > 0) {
          const indexToUse = Math.min(currentIndex, dataToUse.length - 1);
          initializeGame(dataToUse[indexToUse]);
        }
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game data. Please try again later.');
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Use a more secure random number approach
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  const initializeGame = (item: SentenceGameItem) => {
    if (!item || !item.sentenceParts || !Array.isArray(item.sentenceParts)) {
      console.error('Invalid item data for game initialization:', item);
      return;
    }
    
    setSelectedParts([]);
    setShuffledParts(shuffleArray([...item.sentenceParts]));
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handlePartClick = (part: string, index: number) => {
    setSelectedParts([...selectedParts, part]);
    
    const newShuffledParts = [...shuffledParts];
    newShuffledParts.splice(index, 1);
    setShuffledParts(newShuffledParts);
  };

  const handleSelectedPartClick = (part: string, index: number) => {
    setShuffledParts([...shuffledParts, part]);
    
    const newSelectedParts = [...selectedParts];
    newSelectedParts.splice(index, 1);
    setSelectedParts(newSelectedParts);
  };

  const checkAnswer = () => {
    if (!gameData || !gameData[currentIndex]) {
      return;
    }
    
    const currentSentence = gameData[currentIndex].sentence;
    const userSentence = selectedParts.join(' ');
    
    const isAnswerCorrect = currentSentence === userSentence;
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    
  };

  const handleNext = () => {
    if (currentIndex < gameData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      initializeGame(gameData[nextIndex]);
    }
  };

  const handleReset = () => {
    const currentItem = gameData[currentIndex];
    setSelectedParts([]);
    setShuffledParts(shuffleArray([...currentItem.sentenceParts]));
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const shuffleData = () => {
    if (isShuffled) {
      // Restore original order
      setGameData([...allGameData]);
      setIsShuffled(false);
      // Initialize with the first item in the original order
      setCurrentIndex(0);
      if (allGameData.length > 0) {
        initializeGame(allGameData[0]);
      }
    } else {
      // Shuffle the data
      const shuffled = [...allGameData].sort(() => Math.random() - 0.5);
      setGameData(shuffled);
      setIsShuffled(true);
      // Initialize with the first item in the shuffled order
      setCurrentIndex(0);
      if (shuffled.length > 0) {
        initializeGame(shuffled[0]);
      }
    }
  };

  const handleJumpToSentence = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIndex = parseInt(jumpToIndex) - 1;
    
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= gameData.length) {
      alert(`Please enter a number between 1 and ${gameData.length}`);
      return;
    }
    
    setCurrentIndex(targetIndex);
    initializeGame(gameData[targetIndex]);
    setJumpToIndex('');
  };

  if (loading) return <div className="loading">Loading sentence game...</div>;
  if (error) return <div className="error">{error}</div>;
  if (gameData.length === 0) return <div className="empty">No sentence game data found.</div>;

  const currentItem = gameData[currentIndex];

  return (
    <div className="sentence-game-container">
      <h1>Korean Sentence Game</h1>
      
      <div className="game-controls top-controls">
        <Button 
          variant={isShuffled ? "check" : "skip"} 
          onClick={shuffleData}
        >
          {isShuffled ? "Unshuffle" : "Shuffle Sentences"}
        </Button>
        
        {!isShuffled && (
          <form onSubmit={handleJumpToSentence} className="jump-form">
            <input
              type="number"
              min="1"
              max={gameData.length}
              value={jumpToIndex}
              onChange={(e) => setJumpToIndex(e.target.value)}
              placeholder={`Go to (1-${gameData.length})`}
              className="jump-input"
            />
            <Button variant="hint" type="submit">Go</Button>
          </form>
        )}
      </div>
      
      <div className="game-instructions">
        <p>Arrange the words to form the correct Korean sentence</p>
        <p className="word-highlight">Key word: <span>{currentItem.word}</span> ({currentItem.meaning})</p>
      </div>
      
      <div className="sentence-area">
        <div className="selected-parts">
          {selectedParts.length > 0 ? (
            selectedParts.map((part, index) => (
              <div 
                key={`selected-${index}`} 
                className="sentence-part selected" 
                onClick={() => handleSelectedPartClick(part, index)}
              >
                {part}
              </div>
            ))
          ) : (
            <div className="empty-selection">
              <p>Select words from below to build the sentence</p>
              <p className="english-hint">{currentItem.translation}</p>
            </div>
          )}
        </div>
        
        {showAnswer && (
          <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
            <div className="correct-sentence">
              Correct sentence: <span>{currentItem.sentence}</span>
            </div>
            <div className="translation">
              {currentItem.translation}
            </div>
          </div>
        )}
        
        {!showAnswer && (
          <div className="shuffled-parts">
            {shuffledParts.map((part, index) => (
              <div 
                key={`shuffled-${index}`} 
                className="sentence-part shuffled" 
                onClick={() => handlePartClick(part, index)}
              >
                {part}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="game-controls bottom-controls">
        <Button variant="back" onClick={handleReset}>
          Reset
        </Button>
        
        {selectedParts.length > 0 && !showAnswer && (
          <Button variant="check" onClick={checkAnswer}>
            Check Answer
          </Button>
        )}
        
        {showAnswer && (
          <Button variant="skip" onClick={handleNext} disabled={currentIndex === gameData.length - 1}>
            Next Sentence
          </Button>
        )}
      </div>
      
      <div className="progress">
        {currentIndex + 1} of {gameData.length}
      </div>
    </div>
  );
};

export default SentenceGamePage; 