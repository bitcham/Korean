/**
 * Extracts a Korean sentence and its translation from a formatted string
 * @param sampleSentence Sample sentence in format "Korean / English"
 * @returns Object containing Korean sentence and English translation
 */
export const extractSentenceParts = (sampleSentence: string): { 
  koreanSentence: string;
  englishTranslation: string;
} => {
  if (!sampleSentence || !sampleSentence.includes('/')) {
    return { koreanSentence: '', englishTranslation: '' };
  }
  
  try {
    const parts = sampleSentence.split('/');
    return {
      koreanSentence: parts[0]?.trim() || '',
      englishTranslation: parts[1]?.trim() || ''
    };
  } catch (error) {
    return { koreanSentence: '', englishTranslation: '' };
  }
};

/**
 * Safe parsing of integers
 * @param value The value to parse
 * @param defaultValue Default value if parsing fails
 * @returns Parsed integer or default value
 */
export const safeParseInt = (value: string | number | undefined, defaultValue = 0): number => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  try {
    if (typeof value === 'number') {
      return value;
    }
    
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? defaultValue : parsedValue;
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Safe conversion to string
 * @param value The value to convert
 * @param defaultValue Default value if conversion fails
 * @returns String value or default
 */
export const safeString = (value: string | number | undefined, defaultValue = ''): string => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  try {
    return String(value);
  } catch (error) {
    return defaultValue;
  }
}; 