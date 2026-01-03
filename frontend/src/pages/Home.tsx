import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Table } from "@/components/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Centered Title and Subtitle Section - Takes full viewport height minus navbar */}
      <div className="min-h-screen sm:min-h-[calc(100vh-64px)] flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-8">
        <div className="flex flex-col items-center justify-center gap-6 ">
          <p className="text-5xl font-bold text-foreground">
            {displayed}
            <span className="ml-1 animate-pulse">|</span>
          </p>
          {displayed === title && (
            <p className="text-2xl text-muted-foreground">
              {displayedSubtitle}
            </p>
          )}
        </div>
        <div className="fade-in animate-pulse">
          <Button
            variant="outline"
            onClick={() => {
              const leaderboard = document.getElementById("leaderboard");
              if (leaderboard) {
                leaderboard.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="flex flex-col w-full max-w-4xl mx-auto px-8 pb-8 gap-8 min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle id="leaderboard" className="text-2xl font-bold">
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
