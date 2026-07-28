import type { LanguageCode } from './language';

export type MaterialType = 'conversation' | 'speech' | 'monologue' | 'dialogue';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Material {
  id: string;
  title: string;
  description: string;
  language: LanguageCode;
  level: CEFRLevel;
  topic: string;
  type: MaterialType;
  sourceUrl?: string;
  duration: number;
  sentenceCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Sentence {
  id: string;
  materialId: string;
  order: number;
  text: string;
  translation?: string;
  startTime: number;
  endTime: number;
  duration: number;
  language: LanguageCode;
}
