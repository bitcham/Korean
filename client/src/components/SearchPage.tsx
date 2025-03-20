import React, { useState } from 'react';
import './SearchPage.css';
import Button from './Button';

interface Word {
    id: number;
    korean: string;
    english: string;
    romanization?: string;
    category?: string;
}

interface Sentence {
    id: number;
    korean: string;
    english: string;
    words: number[];
}

interface SearchResult {
    words: Word[];
    sentences: Sentence[];
    total: number;
}

const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiUrl}/korean/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            setResults(data.data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to perform search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-page">
            <h1>Korean Dictionary Search</h1>

            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search in Korean or English..."
                    className="search-input"
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {results && (
                <div className="search-results">
                    <p className="results-summary">
                        Found {results.total} results for "{query}"
                    </p>

                    {results.words.length > 0 && (
                        <div className="words-section">
                            <h2>Words</h2>
                            <div className="word-cards">
                                {results.words.map((word) => (
                                    <div key={word.id} className="word-card">
                                        <div className="korean">{word.korean}</div>
                                        <div className="english">{word.english}</div>
                                        {word.romanization && (
                                            <div className="romanization">{word.romanization}</div>
                                        )}
                                        {word.category && (
                                            <div className="category">{word.category}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.sentences.length > 0 && (
                        <div className="sentences-section">
                            <h2>Sentences</h2>
                            <div className="sentence-cards">
                                {results.sentences.map((sentence) => (
                                    <div key={sentence.id} className="sentence-card">
                                        <div className="korean">{sentence.korean}</div>
                                        <div className="english">{sentence.english}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.total === 0 && (
                        <p className="no-results">No results found. Try a different search term.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage; 