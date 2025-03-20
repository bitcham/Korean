import { Router } from 'express';
import * as koreanController from '../../controllers/koreanController';

const router = Router();

/**
 * @route   GET /api/korean/search
 * @desc    Search Korean words and sentences by keyword
 * @access  Public
 */
router.get('/search', koreanController.searchKorean);

/**
 * @route   GET /api/korean/flashcards
 * @desc    Get flashcards for Korean vocabulary learning
 * @access  Public
 */
router.get('/flashcards', koreanController.getFlashcards);

/**
 * @route   GET /api/korean/sentence-game
 * @desc    Get data for sentence ordering game
 * @access  Public
 */
router.get('/sentence-game', koreanController.getSentenceGameData);

export default router; 