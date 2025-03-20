import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { extractSentenceParts, safeParseInt, safeString } from '../utils/dataUtils';

export interface KoreanDataItem {
  id: string;
  korean: string;
  english: string;
  sample_sentence: string;
}

export interface FlashcardItem {
  id: number;
  korean: string;
  english: string;
  sample_sentence: string;
}

export interface SentenceGameItem {
  id: number;
  word: string;
  meaning: string;
  sentence: string;
  translation: string;
  sentenceParts: string[];
}

// Cache mechanism for Korean data
let cachedKoreanData: KoreanDataItem[] | null = null;
let lastCacheTime: number = 0;
const CACHE_TTL = parseInt(process.env.DATA_CACHE_TTL || '3600000'); // Default: 1 hour in milliseconds

/**
 * Read and parse Korean data from CSV file
 * @returns Array of Korean vocabulary items
 */
const readKoreanData = (): KoreanDataItem[] => {
  try {
    const filePath = path.join(__dirname, '../data/Korean_clean.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    return records;
  } catch (error) {
    console.error('Error reading Korean data:', error);
    return [];
  }
};

/**
 * Get Korean data with caching to improve performance
 * @returns Cached or fresh Korean data
 */
export const getKoreanData = (): KoreanDataItem[] => {
  const now = Date.now();
  
  // Refresh cache if expired or doesn't exist
  if (!cachedKoreanData || now - lastCacheTime > CACHE_TTL) {
    cachedKoreanData = readKoreanData();
    lastCacheTime = now;
    console.log('Korean data cache refreshed');
  }
  
  return cachedKoreanData;
};

/**
 * Format data for flashcards
 * @returns Array of flashcard items
 */
export const getFlashcardData = (): FlashcardItem[] => {
  const koreanData = getKoreanData();
  
  if (!Array.isArray(koreanData) || koreanData.length === 0) {
    return [];
  }
  
  return koreanData.map((item: KoreanDataItem) => ({
    id: safeParseInt(item.id),
    korean: safeString(item.korean),
    english: safeString(item.english),
    sample_sentence: safeString(item.sample_sentence)
  }));
};

/**
 * Format and filter data for sentence game
 * @returns Array of sentence game items
 */
export const getSentenceGameData = (): SentenceGameItem[] => {
  const koreanData = getKoreanData();
  
  if (!Array.isArray(koreanData) || koreanData.length === 0) {
    return [];
  }
  
  return koreanData
    .filter((item: KoreanDataItem) => {
      // Check if the sentence has a Korean part
      if (!item.sample_sentence || !item.sample_sentence.includes('/')) {
        return false;
      }
      
      const { koreanSentence } = extractSentenceParts(item.sample_sentence);
      // Ensure it's a proper sentence with at least 3 words
      return koreanSentence && koreanSentence.split(' ').length >= 3;
    })
    .map((item: KoreanDataItem) => {
      // Properly extract the Korean part of the sample sentence
      const { koreanSentence, englishTranslation } = extractSentenceParts(item.sample_sentence);
      
      return {
        id: safeParseInt(item.id),
        word: safeString(item.korean),
        meaning: safeString(item.english),
        sentence: koreanSentence,
        translation: englishTranslation,
        sentenceParts: koreanSentence.split(' ')
      };
    });
}; 