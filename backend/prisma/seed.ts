import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const typingTexts = [
  // EASY
  {
    text: "The quick brown fox jumps over the lazy dog",
    difficulty: "easy",
  },
  {
    text: "Type as fast as you can to improve your typing speed",
    difficulty: "easy",
  },
  {
    text: "Practice makes perfect when it comes to typing skills",
    difficulty: "easy",
  },
  {
    text: "Speed and accuracy are both important in typing",
    difficulty: "easy",
  },
  {
    text: "Keep practicing to become a better typist every day",
    difficulty: "easy",
  },
  {
    text: "Good habits lead to better results over time",
    difficulty: "easy",
  },
  {
    text: "Typing every day helps build muscle memory",
    difficulty: "easy",
  },
  {
    text: "Stay relaxed and focused while typing",
    difficulty: "easy",
  },
  {
    text: "Accuracy should come before speed",
    difficulty: "easy",
  },
  {
    text: "Consistent practice leads to improvement",
    difficulty: "easy",
  },

  // MEDIUM
  {
    text: "Programming is the art of telling another human what one wants the computer to do",
    difficulty: "medium",
  },
  {
    text: "The best way to learn is by doing and practicing regularly",
    difficulty: "medium",
  },
  {
    text: "Technology has transformed the way we work and communicate",
    difficulty: "medium",
  },
  {
    text: "Consistency is key to mastering any skill including typing",
    difficulty: "medium",
  },
  {
    text: "Focus and concentration will help you type more accurately",
    difficulty: "medium",
  },
  {
    text: "Every expert was once a beginner who never gave up on their dreams",
    difficulty: "medium",
  },
  {
    text: "The journey of a thousand miles begins with a single step forward",
    difficulty: "medium",
  },
  {
    text: "Typing efficiently saves time and reduces mental effort",
    difficulty: "medium",
  },
  {
    text: "Clear goals and steady practice lead to long term success",
    difficulty: "medium",
  },
  {
    text: "Improving typing speed requires patience and discipline",
    difficulty: "medium",
  },

  // HARD
  {
    text: "The computer is an incredibly powerful tool that can help us solve complex problems",
    difficulty: "hard",
  },
  {
    text: "Software development requires attention to detail and logical thinking",
    difficulty: "hard",
  },
  {
    text: "Learning to code opens up endless possibilities for creativity and innovation",
    difficulty: "hard",
  },
  {
    text: "Modern applications rely heavily on fast and accurate keyboard input",
    difficulty: "hard",
  },
  {
    text: "Developers must balance performance readability and maintainability in their code",
    difficulty: "hard",
  },
  {
    text: "Building scalable systems requires careful planning and thoughtful design decisions",
    difficulty: "hard",
  },
  {
    text: "Strong problem solving skills are essential for successful software engineers",
    difficulty: "hard",
  },
  {
    text: "Typing proficiency improves gradually through focused and intentional practice",
    difficulty: "hard",
  },
  {
    text: "Well structured code is easier to understand test and maintain over time",
    difficulty: "hard",
  },
  {
    text: "Mastery is achieved through continuous learning and consistent effort",
    difficulty: "hard",
  },
];

async function main() {
  console.log("Seeding typing texts...");

  for (const textData of typingTexts) {
    await prisma.typingText.upsert({
      where: {
        text: textData.text,
      },
      update: {
        difficulty: textData.difficulty,
        isActive: true,
      },
      create: {
        text: textData.text,
        difficulty: textData.difficulty,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${typingTexts.length} typing texts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
