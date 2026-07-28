import { create } from 'zustand';
import type { Sentence } from '@/models';

export type PracticeMode = 'speaking' | 'listening' | null;

interface PracticeState {
  mode: PracticeMode;
  materialId: string | null;
  sentences: Sentence[];
  currentIndex: number;
  scores: number[];
  isActive: boolean;

  startSession: (materialId: string, sentences: Sentence[], mode: 'speaking' | 'listening') => void;
  nextSentence: () => void;
  prevSentence: () => void;
  recordScore: (score: number) => void;
  endSession: () => void;
  resetSession: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  mode: null,
  materialId: null,
  sentences: [],
  currentIndex: 0,
  scores: [],
  isActive: false,

  startSession: (materialId, sentences, mode) => {
    set({
      mode,
      materialId,
      sentences,
      currentIndex: 0,
      scores: new Array(sentences.length).fill(0),
      isActive: true,
    });
  },

  nextSentence: () => {
    const { currentIndex, sentences } = get();
    if (currentIndex < sentences.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevSentence: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  recordScore: (score) => {
    const { currentIndex, scores } = get();
    const newScores = [...scores];
    newScores[currentIndex] = score;
    set({ scores: newScores });
  },

  endSession: () => {
    set({ isActive: false });
  },

  resetSession: () => {
    set({
      mode: null,
      materialId: null,
      sentences: [],
      currentIndex: 0,
      scores: [],
      isActive: false,
    });
  },
}));
