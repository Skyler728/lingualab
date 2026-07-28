import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { LanguageCode, Material, WordCard, SentenceCard } from '@/models';

export function useLiveMaterials(language?: LanguageCode) {
  return useLiveQuery(async () => {
    let collection = db.materials.orderBy('createdAt');
    const all = await collection.reverse().toArray();
    if (language) return all.filter((m) => m.language === language);
    return all;
  }, [language]);
}

export function useLiveWordCards(language?: LanguageCode, state?: string) {
  return useLiveQuery(async () => {
    let collection = db.wordCards.orderBy('createdAt');
    const all = await collection.reverse().toArray();
    return all.filter((c) => {
      if (language && c.language !== language) return false;
      if (state && c.state !== state) return false;
      return true;
    });
  }, [language, state]);
}

export function useLiveSentenceCards(language?: LanguageCode, state?: string) {
  return useLiveQuery(async () => {
    let collection = db.sentenceCards.orderBy('createdAt');
    const all = await collection.reverse().toArray();
    return all.filter((c) => {
      if (language && c.language !== language) return false;
      if (state && c.state !== state) return false;
      return true;
    });
  }, [language, state]);
}

export function useDueWordCardsCount(language?: LanguageCode) {
  return useLiveQuery(async () => {
    const now = Date.now();
    let collection = db.wordCards.where('due').below(now);
    const all = await collection.toArray();
    if (language) return all.filter((c) => c.language === language).length;
    return all.length;
  }, [language]);
}

export function useDueSentenceCardsCount(language?: LanguageCode) {
  return useLiveQuery(async () => {
    const now = Date.now();
    let collection = db.sentenceCards.where('due').below(now);
    const all = await collection.toArray();
    if (language) return all.filter((c) => c.language === language).length;
    return all.length;
  }, [language]);
}
