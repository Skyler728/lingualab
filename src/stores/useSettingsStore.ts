import { create } from 'zustand';
import { db } from '@/db';
import type { UserSettings, LanguageCode, ThemeMode } from '@/models';

interface SettingsState {
  settings: UserSettings | null;
  loaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loaded: false,

  loadSettings: async () => {
    let settings = await db.settings.get(1);
    if (!settings) {
      settings = {
        id: 1,
        nativeLanguage: 'zh-CN',
        learningLanguages: ['en', 'yue', 'ja', 'ko', 'fr'],
        primaryLanguage: 'en' as LanguageCode,
        speechRate: 0.9,
        dailyWordGoal: 20,
        dailySentenceGoal: 10,
        dailySpeakingGoal: 5,
        dailyListeningGoal: 3,
        theme: 'system' as ThemeMode,
      };
      await db.settings.put(settings);
    }
    set({ settings, loaded: true });
  },

  updateSettings: async (partial) => {
    const current = get().settings;
    if (!current) return;
    const updated = { ...current, ...partial };
    await db.settings.put(updated);
    set({ settings: updated });
  },
}));
