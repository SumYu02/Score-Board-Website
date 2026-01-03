-- CreateTable
CREATE TABLE "TypingText" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypingText_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TypingText_text_key" ON "TypingText"("text");

-- CreateIndex
CREATE INDEX "TypingText_isActive_idx" ON "TypingText"("isActive");

-- CreateIndex
CREATE INDEX "TypingText_difficulty_idx" ON "TypingText"("difficulty");
