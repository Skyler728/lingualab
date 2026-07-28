export interface DailyStats {
  id: string;
  date: string;
  wordsReviewed: number;
  wordsLearned: number;
  sentencesReviewed: number;
  speakingAttempts: number;
  speakingScore: number;
  listeningSessions: number;
  listeningScore: number;
  totalStudyTime: number;
  streak: number;
}
