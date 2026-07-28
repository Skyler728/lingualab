export type LanguageCode = 'en' | 'yue' | 'ja' | 'ko' | 'fr';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  speechRecognition: boolean;
  speechSynthesis: boolean;
  edgeTTSFallback: boolean;
  ttsVoiceCode?: string;
  sttLangCode?: string;
  ttsLangCode?: string;
}
