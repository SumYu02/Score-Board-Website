import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";

export function Home() {
  const [displayed, setDisplayed] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");

  const title = "Welcome to the Score Board";
  const subtitle = "This is a simple score board for your games.";

  useEffect(() => {
    let titleIndex = 0;
    let subtitleIndex = 0;

    const titleInterval = setInterval(() => {
      setDisplayed(title.slice(0, titleIndex + 1));
      titleIndex++;

      if (titleIndex === title.length) {
        clearInterval(titleInterval);

        const subtitleInterval = setInterval(() => {
          setDisplayedSubtitle(subtitle.slice(0, subtitleIndex + 1));
          subtitleIndex++;

          if (subtitleIndex === subtitle.length) {
            clearInterval(subtitleInterval);
          }
        }, 50);
      }
    }, 80);

    return () => {
      clearInterval(titleInterval);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col w-full max-w-3xl mx-auto sm:h-[calc(100vh-64px)] p-8 items-center justify-center gap-6">
        <p className="text-5xl font-bold text-foreground">
          {displayed}
          <span className="ml-1 animate-pulse">|</span>
        </p>
        {displayed === title && (
          <p className="text-2xl text-muted-foreground">{displayedSubtitle}</p>
        )}
      </div>
    </div>
  );
}
