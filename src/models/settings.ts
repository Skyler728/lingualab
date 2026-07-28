import type { LanguageCode } from './language';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserSettings {
  id: number;
  nativeLanguage: string;
  learningLanguages: LanguageCode[];
  primaryLanguage: LanguageCode;
  speechRate: number;
  dailyWordGoal: number;
  dailySentenceGoal: number;
  dailySpeakingGoal: number;
  dailyListeningGoal: number;
  theme: ThemeMode;
  edgeTTSEndpoint?: string;
}
