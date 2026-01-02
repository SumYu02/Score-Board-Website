import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Update score endpoint (protected)
router.post('/update', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { action } = req.body;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }

    // Increment score
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: {
          increment: 1, // Increment by 1 for each action
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        score: true,
      },
    });

    // Log the action
    await prisma.actionLog.create({
      data: {
        userId,
        action: action || 'COMPLETE_ACTION',
      },
    });

    res.json({
      message: 'Score updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Score update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top 10 users endpoint
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const topUsers = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        score: true,
        createdAt: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: 10,
    });

    res.json({
      leaderboard: topUsers,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user's score
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        score: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

