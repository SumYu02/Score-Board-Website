import type { Request, Response } from "express";
import prisma from "../src/lib/prisma.js";

export async function getRandomTypingText(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Get a random active typing text
    const activeTexts = await prisma.typingText.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        text: true,
        difficulty: true,
      },
    });

    if (activeTexts.length === 0) {
      res.status(404).json({
        error: "No typing texts available. Please contact administrator.",
      });
      return;
    }

    // Select a random text
    const randomIndex = Math.floor(Math.random() * activeTexts.length);
    const randomText = activeTexts[randomIndex];

    if (
      !randomText ||
      !randomText.id ||
      !randomText.text ||
      !randomText.difficulty
    ) {
      res.status(404).json({
        error: "No typing texts available. Please contact administrator.",
      });
      return;
    }

    res.json({
      id: randomText.id,
      text: randomText.text,
      difficulty: randomText.difficulty,
    });
  } catch (error) {
    console.error("Get typing text error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
