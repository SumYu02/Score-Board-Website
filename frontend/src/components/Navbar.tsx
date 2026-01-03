import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, Key, User, LogOut, Gamepad2 } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { scoreService } from "@/services/scoreService";
import { useQuery } from "@tanstack/react-query";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardContent } from "./ui/card";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, user, setAuth } = useAuthStore();
  const lastUpdatedScoreRef = useRef<number | null>(null);

  // Reset ref when user changes
  useEffect(() => {
    lastUpdatedScoreRef.current = user?.score ?? null;
  }, [user?.id]);

  useEffect(() => {
    const checkTheme = () => {
      const root = document.documentElement;
      setIsDark(root.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, [theme]);

  const { data: userScoreData, isLoading: isLoadingScore } = useQuery({
    queryKey: ["userScore", user?.id],
    queryFn: scoreService.getCurrentUserScore,
    enabled: isAuthenticated && !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    const newScore = userScoreData?.user?.score;
    if (
      newScore !== undefined &&
      user &&
      newScore !== user.score &&
      newScore !== lastUpdatedScoreRef.current
    ) {
      const token = localStorage.getItem("token");
      if (token) {
        lastUpdatedScoreRef.current = newScore;
        setAuth(
          {
            ...user,
            score: newScore,
          },
          token
        );
      }
    }
  }, [userScoreData?.user?.score, user, setAuth]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentlyDark = root.classList.contains("dark");

    if (currentlyDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div
          className="flex items-center justify-center gap-2 "
          onClick={() => navigate("/")}
        >
          <div className="flex h-8 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">%</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Score Board
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-bold">
                    User Profile
                  </DrawerTitle>
                  <DrawerDescription>
                    View your account information and progress
                  </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-6">
                  <Card className="border-none shadow-none">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold">
                            {user?.username}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Score
                          </span>
                          <span className="text-2xl font-bold text-primary">
                            {isLoadingScore
                              ? "..."
                              : userScoreData?.user.score ?? user?.score ?? 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <DrawerFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      useAuthStore.getState().logout();
                      navigate("/login");
                    }}
                    className="p-5"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")}
            >
              <Key className="h-7 w-7" />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => navigate("/game")}>
            <Gamepad2 className="h-7 w-7" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-md transition-colors hover:bg-accent"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Sun className="h-7 w-7 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-7 w-7 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
