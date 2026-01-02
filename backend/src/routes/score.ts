import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as scoreController from '../../controller/score_controller.js';

const router = Router();

// Update score endpoint (protected)
router.post('/update', authenticateToken, scoreController.updateScore);

// Get top 10 users endpoint
router.get('/leaderboard', scoreController.getLeaderboard);

// Get current user's score
router.get('/me', authenticateToken, scoreController.getCurrentUserScore);

export default router;

