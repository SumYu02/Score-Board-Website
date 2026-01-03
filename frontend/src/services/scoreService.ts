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

export interface SubmitScoreResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    score: number;
  };
}

export interface TypingGameStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  charactersCorrect: number;
  timeElapsed: number;
}

export interface TypingGameScoreResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    score: number;
  };
  pointsEarned: number;
  gameStats: {
    wpm: number;
    accuracy: number;
    wordsTyped: number;
    charactersCorrect: number;
  };
}

export const scoreService = {
  getLeaderboard: async (): Promise<LeaderboardResponse> => {
    const response = await api.get<LeaderboardResponse>(
      "/api/score/leaderboard"
    );
    return response.data;
  },
  submitScore: async (
    action: string = "TYPING_GAME"
  ): Promise<SubmitScoreResponse> => {
    const response = await api.post<SubmitScoreResponse>("/api/score/update", {
      action,
    });
    return response.data;
  },
  submitTypingGameScore: async (
    stats: TypingGameStats
  ): Promise<TypingGameScoreResponse> => {
    const response = await api.post<TypingGameScoreResponse>(
      "/api/score/typing-game",
      stats
    );
    return response.data;
  },
};
