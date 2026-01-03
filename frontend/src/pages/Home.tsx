import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { Table } from "@/components/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleChevronDown, Rocket } from "lucide-react";
import Github from "@/components/Github";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const [displayed, setDisplayed] = useState("");
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");

  const title = "Welcome to the Score Board";
  const subtitle = "This is a simple typing game.";

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

  const scrollToLeaderboard = () => {
    const leaderboard = document.getElementById("leaderboard");
    if (leaderboard) {
      const navbarHeight = 26;
      const elementPosition = leaderboard.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="min-h-[calc(70vh)] sm:min-h-[calc(100vh-64px)] flex flex-col items-center justify-between sm:justify-center w-full max-w-4xl mx-auto  ">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 ">
          <p className="text-4xl sm:text-5xl font-bold text-foreground text-center">
            {displayed}
            <span className="ml-1 animate-pulse">|</span>
          </p>
          {displayed === title && (
            <p className="text-xl sm:text-2xl text-muted-foreground text-center">
              {displayedSubtitle}
            </p>
          )}
        </div>

        <div className="flex absolute bottom-50 sm:bottom-20  justify-center items-center w-full pb-4 sm:mt-8 sm:pb-0 animate-in fade-in duration-500">
          <CircleChevronDown
            className="size-10 animate-pulse cursor-pointer"
            onClick={scrollToLeaderboard}
          />
        </div>
      </div>

      {/* Leaderboard Section */}
      <div
        id="leaderboard"
        className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-8 py-16 gap-8"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>

            <Button
              variant="link"
              onClick={() => navigate("/game")}
              className="text-primary  animate-pulse"
            >
              <Rocket className="size-4" /> Play Game
            </Button>
          </CardHeader>
          <CardContent>
            <Table />
          </CardContent>
        </Card>
      </div>
      <div className="w-full max-w-4xl mx-auto px-8 py-16">
        <Github />
      </div>

      <Footer />
    </div>
  );
}
