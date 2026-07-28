import Dexie, { type Table } from 'dexie';
import type {
  Material,
  Sentence,
  WordCard,
  SentenceCard,
  SpeakingAttempt,
  ListeningSession,
  ListeningAnswer,
  DailyStats,
  UserSettings,
} from '@/models';

export class LanguageWorkbenchDB extends Dexie {
  materials!: Table<Material, string>;
  sentences!: Table<Sentence, string>;
  wordCards!: Table<WordCard, string>;
  sentenceCards!: Table<SentenceCard, string>;
  speakingAttempts!: Table<SpeakingAttempt, string>;
  listeningSessions!: Table<ListeningSession, string>;
  listeningAnswers!: Table<ListeningAnswer, string>;
  dailyStats!: Table<DailyStats, string>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('LanguageWorkbenchDB');

    this.version(1).stores({
      materials: 'id, language, level, topic, createdAt',
      sentences: 'id, materialId, [materialId+order], language',
      wordCards: 'id, language, [language+due], due, createdAt',
      sentenceCards: 'id, language, [language+due], due, createdAt',
      speakingAttempts: 'id, sentenceId, materialId, createdAt',
      listeningSessions: 'id, materialId, createdAt',
      listeningAnswers: 'id, sessionId, [sessionId+questionIndex]',
      dailyStats: 'id',
      settings: 'id',
    });
  }
}

export const db = new LanguageWorkbenchDB();
