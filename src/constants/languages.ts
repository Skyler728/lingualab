import type { LanguageCode, LanguageMeta } from '@/models/language';

export const LANGUAGE_META: Record<LanguageCode, LanguageMeta> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechRecognition: true,
    speechSynthesis: true,
    edgeTTSFallback: false,
    sttLangCode: 'en-US',
    ttsLangCode: 'en-US',
  },
  yue: {
    code: 'yue',
    name: 'Cantonese',
    nativeName: '粵語',
    flag: '🇭🇰',
    speechRecognition: false,
    speechSynthesis: false,
    edgeTTSFallback: true,
    ttsVoiceCode: 'zh-HK-HiuMaanNeural',
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechRecognition: true,
    speechSynthesis: true,
    edgeTTSFallback: false,
    sttLangCode: 'ja-JP',
    ttsLangCode: 'ja-JP',
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    speechRecognition: true,
    speechSynthesis: true,
    edgeTTSFallback: false,
    sttLangCode: 'ko-KR',
    ttsLangCode: 'ko-KR',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechRecognition: true,
    speechSynthesis: true,
    edgeTTSFallback: false,
    sttLangCode: 'fr-FR',
    ttsLangCode: 'fr-FR',
  },
};

export const ALL_LANGUAGES: LanguageCode[] = ['en', 'yue', 'ja', 'ko', 'fr'];
export const SPEECH_SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'ja', 'ko', 'fr'];
