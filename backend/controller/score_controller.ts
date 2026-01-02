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
