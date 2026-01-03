import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scoreService } from "@/services/scoreService";
import { typingService } from "@/services/typingService";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const GAME_DURATION = 60; // 60 seconds

type GameState = "idle" | "playing" | "finished";

interface GameStats {
  wordsTyped: number;
  charactersTyped: number;
  charactersCorrect: number;
  wpm: number;
  accuracy: number;
}

export function Typing() {
  const { isAuthenticated } = useAuthStore();
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [stats, setStats] = useState<GameStats>({
    wordsTyped: 0,
    charactersTyped: 0,
    charactersCorrect: 0,
    wpm: 0,
    accuracy: 0,
  });
  const [wordIndex, setWordIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch random text from backend
  const fetchRandomText = useCallback(async () => {
    try {
      setIsLoadingText(true);
      const textData = await typingService.getRandomText();
      return textData.text;
    } catch (error: any) {
      console.error("Error fetching typing text:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to load typing text. Please try again."
      );
      return null;
    } finally {
      setIsLoadingText(false);
    }
  }, []);

  // Initialize game
  const startGame = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to play the typing game");
      return;
    }

    // Fetch text from backend
    const text = await fetchRandomText();
    if (!text) {
      return; // Error already shown in fetchRandomText
    }

    setCurrentText(text);
    setUserInput("");
    setTimeLeft(GAME_DURATION);
    setWordIndex(0);
    setStats({
      wordsTyped: 0,
      charactersTyped: 0,
      charactersCorrect: 0,
      wpm: 0,
      accuracy: 0,
    });
    setGameState("playing");

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End game
  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("finished");
    inputRef.current?.blur();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "playing") return;

    const value = e.target.value;
    setUserInput(value);

    // Calculate stats
    const newStats = { ...stats };
    newStats.charactersTyped = value.length;

    // Count correct characters
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) {
        correct++;
      }
    }
    newStats.charactersCorrect = correct;
    newStats.accuracy =
      newStats.charactersTyped > 0
        ? Math.round((correct / newStats.charactersTyped) * 100)
        : 0;

    // Calculate WPM (words per minute)
    // WPM = (characters typed / 5) / (time elapsed / 60)
    const timeElapsed = GAME_DURATION - timeLeft;
    const wordsTyped = correct / 5;
    newStats.wpm =
      timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;

    setStats(newStats);

    // Check if text is completed
    if (value === currentText) {
      // Move to next word - fetch new text from backend
      const newWordIndex = wordIndex + 1;
      setWordIndex(newWordIndex);

      // Fetch new text from backend
      fetchRandomText().then((newText) => {
        if (newText) {
          setCurrentText(newText);
          setUserInput("");
          newStats.wordsTyped = newWordIndex + 1;
          setStats(newStats);
        }
      });
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && gameState === "idle") {
      startGame();
    }
  };

  // Submit score
  const submitScore = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit your score");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate time elapsed
      const timeElapsed = GAME_DURATION - timeLeft;

      // Submit game stats to backend for validation and secure score calculation
      const response = await scoreService.submitTypingGameScore({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        wordsTyped: stats.wordsTyped,
        charactersCorrect: stats.charactersCorrect,
        timeElapsed,
      });

      toast.success(
        `Score submitted! You earned ${response.pointsEarned} points (${stats.wpm} WPM, ${stats.accuracy}% accuracy)`
      );

      // Reset game
      setGameState("idle");
      setUserInput("");
      setCurrentText("");
      setTimeLeft(GAME_DURATION);
      setWordIndex(0);
      setStats({
        wordsTyped: 0,
        charactersTyped: 0,
        charactersCorrect: 0,
        wpm: 0,
        accuracy: 0,
      });
    } catch (error: any) {
      console.error("Error submitting score:", error);
      toast.error(error.response?.data?.error || "Failed to submit score");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Render character with color coding
  const renderTextWithHighlight = () => {
    return currentText.split("").map((char, index) => {
      if (index < userInput.length) {
        const isCorrect = userInput[index] === char;
        return (
          <span
            key={index}
            className={
              isCorrect ? "text-green-500" : "text-red-500 bg-red-500/20"
            }
          >
            {char}
          </span>
        );
      }
      return (
        <span key={index} className="text-muted-foreground">
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-center">
            Typing Game
          </h1>

          {gameState === "idle" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Ready to Test Your Typing Speed?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Type as many words as you can in {GAME_DURATION} seconds! Your
                  score will be based on your words per minute (WPM) and
                  accuracy.
                </p>
                {!isAuthenticated && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⚠️ Please login to play and submit your score
                  </p>
                )}
                <Button
                  onClick={startGame}
                  className="w-full"
                  size="lg"
                  disabled={isLoadingText}
                >
                  {isLoadingText ? "Loading..." : "Start Game"}
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === "playing" && (
            <div className="w-full space-y-6">
              {/* Timer and Stats */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{timeLeft}s</span>
                      <span className="text-muted-foreground">remaining</span>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.wpm}
                        </div>
                        <div className="text-xs text-muted-foreground">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.accuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Accuracy
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.wordsTyped}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Words
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text to Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Type the text below:</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-muted/50 rounded-lg border min-h-[120px] text-lg sm:text-xl font-mono leading-relaxed">
                    {renderTextWithHighlight()}
                    {userInput.length < currentText.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Input Field */}
              <Card>
                <CardContent className="pt-6">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Start typing..."
                    className="text-lg sm:text-xl font-mono"
                    autoFocus
                    disabled={gameState !== "playing"}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Press Enter to start a new word when you complete the
                    current one
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === "finished" && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Game Over!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {stats.wpm}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      WPM
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {stats.accuracy}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Accuracy
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {stats.wordsTyped}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Words
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {stats.charactersCorrect}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Correct
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={submitScore}
                    disabled={isSubmitting || !isAuthenticated}
                    className="flex-1"
                    size="lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Score"}
                  </Button>
                  <Button
                    onClick={startGame}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    Play Again
                  </Button>
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
                    ⚠️ Login to submit your score and compete on the leaderboard
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
