import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { scoreService } from "@/services/scoreService";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

export function History() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["typingGameHistory", user?.id],
    queryFn: scoreService.getTypingGameHistory,
    enabled: isAuthenticated && !!user,
  });

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please log in to view your typing game history.
              </p>
              <Button onClick={() => navigate("/login")} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Typing Game History
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => navigate("/game")}
                className="flex items-center gap-2"
              >
                <Gamepad2 className="h-4 w-4" /> Play Game
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading history...</p>
              </div>
            ) : historyData?.history && historyData.history.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>WPM</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Words Typed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {Math.round(entry.wpm)}
                        </TableCell>
                        <TableCell>{entry.accuracy.toFixed(1)}%</TableCell>
                        <TableCell>{entry.wordsTyped}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No typing game history yet.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/game")}
                  className="flex items-center gap-2"
                >
                  <Gamepad2 className="h-4 w-4" /> Play Your First Game
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
