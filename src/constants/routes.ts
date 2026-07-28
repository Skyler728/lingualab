export const ROUTES = {
  DASHBOARD: '/',
  SPEAK: '/speak',
  SPEAK_SESSION: '/speak/:materialId',
  LISTEN: '/listen',
  LISTEN_SESSION: '/listen/:materialId',
  VOCABULARY: '/vocabulary',
  VOCABULARY_REVIEW: '/vocabulary/review',
  SENTENCES: '/sentences',
  SENTENCES_REVIEW: '/sentences/review',
  MATERIALS: '/materials',
  MATERIAL_DETAIL: '/materials/:id',
  SETTINGS: '/settings',
} as const;
