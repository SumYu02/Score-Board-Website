import { api } from "@/lib/api";

export interface LeaderboardEntry {
  id: string;
  username: string;
  email: string;
  score: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

export const scoreService = {
  getLeaderboard: async (): Promise<LeaderboardResponse> => {
    const response = await api.get<LeaderboardResponse>(
      "/api/score/leaderboard"
    );
    return response.data;
  },
};
