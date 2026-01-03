import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, Key, User, LogOut } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { scoreService } from "@/services/scoreService";

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
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

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

  // Fetch current user score when authenticated
  useEffect(() => {
    const fetchUserScore = async () => {
      if (isAuthenticated && user) {
        setIsLoadingScore(true);
        try {
          const response = await scoreService.getCurrentUserScore();
          setCurrentScore(response.user.score);

          // Update auth store with latest score
          const token = localStorage.getItem("token");
          if (user && token) {
            setAuth(
              {
                ...user,
                score: response.user.score,
              },
              token
            );
          }
        } catch (error) {
          console.error("Error fetching user score:", error);
          // Fallback to stored score if API fails
          setCurrentScore(user?.score || 0);
        } finally {
          setIsLoadingScore(false);
        }
      } else {
        setCurrentScore(null);
      }
    };

    if (isAuthenticated) {
      fetchUserScore();

      // Refresh score every 30 seconds when authenticated
      const intervalId = setInterval(fetchUserScore, 30000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setCurrentScore(null);
    }
  }, [isAuthenticated, user?.id, user, setAuth]); // Re-fetch when auth state or user ID changes

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
          <Button
            variant="ghost"
            size="icon"
            onClick={!isAuthenticated ? () => navigate("/login") : undefined}
          >
            {isAuthenticated ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <User className="h-6 w-6" />
                  </button>
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
                                : currentScore !== null
                                ? currentScore
                                : user?.score || 0}
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
              <Key className="h-7 w-7" />
            )}
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
