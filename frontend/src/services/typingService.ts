import { api } from "@/lib/api";

export interface TypingText {
  id: string;
  text: string;
  difficulty: string;
}

export const typingService = {
  getRandomText: async (): Promise<TypingText> => {
    const response = await api.get<TypingText>("/api/typing/text");
    return response.data;
  },
};

