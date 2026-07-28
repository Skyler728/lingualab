import { create } from 'zustand';

interface AudioState {
  isRecording: boolean;
  isPlaying: boolean;
  audioLevel: number;
  playbackRate: number;

  setRecording: (recording: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setAudioLevel: (level: number) => void;
  setPlaybackRate: (rate: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isRecording: false,
  isPlaying: false,
  audioLevel: 0,
  playbackRate: 1.0,

  setRecording: (recording) => set({ isRecording: recording }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setAudioLevel: (level) => set({ audioLevel: level }),
  setPlaybackRate: (rate) => set({ playbackRate: rate }),
}));
