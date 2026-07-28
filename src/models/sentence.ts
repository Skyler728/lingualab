import type { LanguageCode } from './language';
import type { CardState } from './vocabulary';

export interface SentenceCard {
  id: string;
  text: string;
  translation?: string;
  source: string;
  language: LanguageCode;
  notes?: string;
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
