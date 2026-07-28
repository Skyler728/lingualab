import type { LanguageCode } from './language';

export type CardState = 'New' | 'Learning' | 'Review' | 'Relearning';

export interface WordCard {
  id: string;
  word: string;
  reading?: string;
  definition: string;
  examples: string[];
  notes?: string;
  language: LanguageCode;
  sourceMaterialId?: string;
  sourceSentenceId?: string;
  state: CardState;
  due: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview?: number;
  createdAt: number;
  updatedAt: number;
}
