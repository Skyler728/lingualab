export interface SpeakingAttempt {
  id: string;
  sentenceId: string;
  materialId?: string;
  audioBlob?: Blob;
  referenceText: string;
  transcript: string;
  score: number;
  duration: number;
  createdAt: number;
}

export interface ListeningSession {
  id: string;
  materialId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
  completedAt: number;
}

export interface ListeningAnswer {
  id: string;
  sessionId: string;
  questionIndex: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}
