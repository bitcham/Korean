import { Request, Response } from 'express';
import * as koreanService from '../services/koreanService';
import logger from '../utils/logger';

/**
 * Get flashcards for learning Korean vocabulary
 * @param req Express request object
 * @param res Express response object
 */
export const getFlashcards = (req: Request, res: Response): void => {
    try {
        const flashcards = koreanService.getFlashcardData();

        if (!flashcards || flashcards.length === 0) {
            res.status(404).json({ error: 'No flashcard data available' });
            return;
        }

        res.json(flashcards);
    } catch (error) {
        console.error('Error retrieving flashcards:', error);
        res.status(500).json({ error: 'Failed to retrieve flashcards' });
    }
};

/**
 * Get data for the sentence ordering game
 * @param req Express request object
 * @param res Express response object
 */
export const getSentenceGameData = (req: Request, res: Response): void => {
    try {
        const sentenceGameData = koreanService.getSentenceGameData();

        if (!sentenceGameData || sentenceGameData.length === 0) {
            res.status(404).json({ error: 'No valid sentence data available for the game' });
            return;
        }

        res.json(sentenceGameData);
    } catch (error) {
        console.error('Error retrieving sentence game data:', error);
        res.status(500).json({ error: 'Failed to retrieve sentence game data' });
    }
};

// Use the CSV data via service functions
const getWordsData = () => {
    const flashcards = koreanService.getFlashcardData();
    return flashcards.map(card => ({
        id: card.id,
        korean: card.korean,
        english: card.english,
        romanization: '',
        category: 'vocabulary'
    }));
};

const getSentencesData = () => {
    const gameData = koreanService.getSentenceGameData();
    return gameData.map(item => ({
        id: item.id,
        korean: item.sentence,
        english: item.translation,
        words: []
    }));
};

// Define the types for our custom arrays
interface KoreanWord {
    id: number;
    korean: string;
    english: string;
    romanization: string;
    category: string;
}

interface KoreanSentence {
    id: number;
    korean: string;
    english: string;
    words: number[];
}

// Temporary storage for created/updated items
let customWords: KoreanWord[] = [];
let customSentences: KoreanSentence[] = [];

/**
 * Helper function to perform a fuzzy search on Korean text
 * Helps match partial Korean characters even without exact matches
 */
const fuzzyKoreanMatch = (text: string, query: string): boolean => {
    // Convert to lowercase for case-insensitive search
    text = text.toLowerCase();
    query = query.toLowerCase();
    
    // Direct match check - return true immediately if query is contained in text
    if (text.includes(query)) return true;
    
    // Logic for Korean search
    if (/[\uAC00-\uD7A3]/.test(query)) { // Check Korean Unicode range
        // If search query is 2 or more characters
        if (query.length >= 2) {
            // For 2+ characters, require at least 2 consecutive characters to match
            for (let i = 0; i < query.length - 1; i++) {
                const twoChars = query.substring(i, i + 2);
                if (text.includes(twoChars)) return true;
            }
            
            // Return false if no consecutive character matches
            return false;
        } 
        // For single character searches, only match if that exact character is included
        else {
            return text.includes(query);
        }
    }
    
    // Logic for English search (word-based matching)
    if (/[a-zA-Z]/.test(query)) {
        const queryWords = query.split(' ');
        const textWords = text.split(' ');
        
        // Check if each query word matches a text word
        for (const queryWord of queryWords) {
            if (queryWord.length < 2) continue; // Skip single-letter words
            
            let found = false;
            for (const textWord of textWords) {
                if (textWord.startsWith(queryWord) || queryWord === textWord) {
                    found = true;
                    break;
                }
            }
            
            if (!found) return false;
        }
        
        return true;
    }
    
    return false;
};

/**
 * @desc    Search Korean words and sentences by keyword
 * @route   GET /api/korean/search
 * @access  Public
 */
export const searchKorean = (req: Request, res: Response): void => {
    try {
        const keyword = req.query.q as string;
        
        if (!keyword || keyword.trim() === '') {
            res.status(400).json({ 
                success: false, 
                error: 'Search keyword is required' 
            });
            return;
        }
        
        const allWords = [...getWordsData(), ...customWords];
        const allSentences = [...getSentencesData(), ...customSentences];
        
        // Search through words with fuzzy matching
        const matchedWords = allWords.filter(word => 
            fuzzyKoreanMatch(word.korean, keyword) || 
            fuzzyKoreanMatch(word.english, keyword)
        );
        
        // Search through sentences with fuzzy matching
        const matchedSentences = allSentences.filter(sentence => 
            fuzzyKoreanMatch(sentence.korean, keyword) || 
            fuzzyKoreanMatch(sentence.english, keyword)
        );
        
        res.status(200).json({
            success: true,
            data: {
                words: matchedWords,
                sentences: matchedSentences,
                total: matchedWords.length + matchedSentences.length
            }
        });
    } catch (error) {
        logger.error(`Error in searchKorean: ${error}`);
        res.status(500).json({ success: false, error: 'Server error' });
    }
}; 