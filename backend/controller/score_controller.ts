import type { Request, Response } from "express";
import prisma from "../src/lib/prisma.js";

export async function updateScore(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { action } = req.body;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      res.status(404).json({ error: "User not found or inactive" });
      return;
    }

    // Rate limiting: Check for rapid submissions (max 10 per minute)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentActions = await prisma.actionLog.count({
      where: {
        userId,
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    if (recentActions >= 10) {
      res.status(429).json({
        error: "Too many requests. Please wait before submitting again.",
      });
      return;
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
        action: action || "COMPLETE_ACTION",
      },
    });

    res.json({
      message: "Score updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Score update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getLeaderboard(
  req: Request,
  res: Response
): Promise<void> {
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
        score: "desc",
      },
      take: 10,
    });

    res.json({
      leaderboard: topUsers,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCurrentUserScore(
  req: Request,
  res: Response
): Promise<void> {
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
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function submitTypingGameScore(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { wpm, accuracy, wordsTyped, charactersCorrect, timeElapsed } =
      req.body;

    // Validate required fields
    if (
      typeof wpm !== "number" ||
      typeof accuracy !== "number" ||
      typeof wordsTyped !== "number" ||
      typeof charactersCorrect !== "number" ||
      typeof timeElapsed !== "number"
    ) {
      res.status(400).json({
        error:
          "Invalid game data. All fields (wpm, accuracy, wordsTyped, charactersCorrect, timeElapsed) are required.",
      });
      return;
    }

    // Validate reasonable ranges to prevent malicious submissions
    // WPM: 0-300 (world record is around 216, but allow some buffer)
    if (wpm < 0 || wpm > 300) {
      res.status(400).json({
        error: "Invalid WPM value. Must be between 0 and 300.",
      });
      return;
    }

    // Accuracy: 0-100%
    if (accuracy < 0 || accuracy > 100) {
      res.status(400).json({
        error: "Invalid accuracy value. Must be between 0 and 100.",
      });
      return;
    }

    // Words typed: must be positive
    if (wordsTyped < 0 || wordsTyped > 1000) {
      res.status(400).json({
        error: "Invalid words typed. Must be between 0 and 1000.",
      });
      return;
    }

    // Time elapsed: should be around 60 seconds (allow 50-70 seconds for network delays)
    if (timeElapsed < 50 || timeElapsed > 70) {
      res.status(400).json({
        error:
          "Invalid game duration. Game must be completed in approximately 60 seconds.",
      });
      return;
    }

    // Check for duplicate submissions (prevent rapid re-submissions)
    // Check if user submitted a typing game score in the last 5 seconds
    const recentSubmission = await prisma.actionLog.findFirst({
      where: {
        userId,
        action: "TYPING_GAME",
        createdAt: {
          gte: new Date(Date.now() - 5000), // Last 5 seconds
        },
      },
    });

    if (recentSubmission) {
      res.status(429).json({
        error:
          "Please wait before submitting again. Duplicate submissions are not allowed.",
      });
      return;
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      res.status(404).json({ error: "User not found or inactive" });
      return;
    }

    // Calculate score: 1 point per 10 WPM, minimum 1 point if WPM > 0
    const scorePoints = Math.max(1, Math.floor(wpm / 10));

    // Update score in a single transaction
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: {
          increment: scorePoints,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        score: true,
      },
    });

    // Log the action with game stats for audit trail
    await prisma.actionLog.create({
      data: {
        userId,
        action: `TYPING_GAME:${wpm}WPM:${accuracy}%:${wordsTyped}words`,
      },
    });

    res.json({
      message: "Typing game score submitted successfully",
      user: updatedUser,
      pointsEarned: scorePoints,
      gameStats: {
        wpm,
        accuracy,
        wordsTyped,
        charactersCorrect,
      },
    });
  } catch (error) {
    console.error("Typing game score submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
