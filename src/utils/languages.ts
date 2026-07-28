import { LANGUAGE_META } from '@/constants/languages';
import type { LanguageCode } from '@/models';

export function getLanguageName(code: LanguageCode): string {
  return LANGUAGE_META[code]?.name ?? code;
}

export function getNativeName(code: LanguageCode): string {
  return LANGUAGE_META[code]?.nativeName ?? code;
}

export function getLanguageFlag(code: LanguageCode): string {
  return LANGUAGE_META[code]?.flag ?? '🌐';
}

export function supportsSpeechRecognition(code: LanguageCode): boolean {
  return LANGUAGE_META[code]?.speechRecognition ?? false;
}

export function supportsSpeechSynthesis(code: LanguageCode): boolean {
  return LANGUAGE_META[code]?.speechSynthesis ?? false;
}
