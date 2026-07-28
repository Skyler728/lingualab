import type { CEFRLevel } from '@/models/material';

export const CEFR_LEVELS: { value: CEFRLevel; label: string; description: string }[] = [
  { value: 'A1', label: 'A1', description: 'Beginner' },
  { value: 'A2', label: 'A2', description: 'Elementary' },
  { value: 'B1', label: 'B1', description: 'Intermediate' },
  { value: 'B2', label: 'B2', description: 'Upper Intermediate' },
  { value: 'C1', label: 'C1', description: 'Advanced' },
  { value: 'C2', label: 'C2', description: 'Proficient' },
];

export const TOPICS = [
  'daily-conversation',
  'business',
  'travel',
  'food',
  'technology',
  'education',
  'health',
  'entertainment',
  'culture',
  'sports',
  'nature',
  'shopping',
] as const;

export type Topic = (typeof TOPICS)[number];

export const TOPIC_LABELS: Record<Topic, string> = {
  'daily-conversation': '日常对话',
  business: '商务',
  travel: '旅行',
  food: '美食',
  technology: '科技',
  education: '教育',
  health: '健康',
  entertainment: '娱乐',
  culture: '文化',
  sports: '运动',
  nature: '自然',
  shopping: '购物',
};

export const MATERIAL_TYPES = [
  { value: 'conversation' as const, label: '对话' },
  { value: 'speech' as const, label: '演讲' },
  { value: 'monologue' as const, label: '独白' },
  { value: 'dialogue' as const, label: '双人对话' },
];
