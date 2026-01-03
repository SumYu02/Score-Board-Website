import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { scoreService } from "@/services/scoreService";

export const Table = () => {
  const { user } = useAuthStore();

  const {
    data: leaderboardData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: scoreService.getLeaderboard,
  });

  const leaderboard = leaderboardData?.leaderboard || [];
  const filledLeaderboard = Array.from({ length: MAX_ROWS }, (_, index) => {
    return leaderboard[index] ?? null;
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load leaderboard. Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <TableComponent>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No scores yet. Be the first to set a record!
              </TableCell>
            </TableRow>
          ) : (
            filledLeaderboard.map((entry, index) => {
              const isCurrentUser = entry && user?.id === entry.id;

              return (
                <TableRow
                  key={entry?.id ?? `empty-${index}`}
                  className={cn(
                    "transition-colors",
                    isCurrentUser &&
                      "bg-muted/80 dark:bg-muted/60 font-medium border-l-4 border-l-primary"
                  )}
                >
                  <TableCell className="px-6 py-4 font-medium">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    {entry ? (
                      <>
                        {entry.username}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary">
                            (You)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {entry?.email ?? "N/A"}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {entry?.score ?? "N/A"}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </TableComponent>
    </div>
  );
};
const MAX_ROWS = 10 as const;
