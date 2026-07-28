import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { SpeakPage } from '@/pages/SpeakPage';
import { SpeakSessionPage } from '@/pages/SpeakSessionPage';
import { ListenPage } from '@/pages/ListenPage';
import { ListenSessionPage } from '@/pages/ListenSessionPage';
import { VocabularyPage } from '@/pages/VocabularyPage';
import { VocabularyReviewPage } from '@/pages/VocabularyReviewPage';
import { SentencesPage } from '@/pages/SentencesPage';
import { SentencesReviewPage } from '@/pages/SentencesReviewPage';
import { MaterialsPage } from '@/pages/MaterialsPage';
import { MaterialDetailPage } from '@/pages/MaterialDetailPage';
import { SettingsPage } from '@/pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'speak',
        children: [
          { index: true, element: <SpeakPage /> },
          { path: ':materialId', element: <SpeakSessionPage /> },
        ],
      },
      {
        path: 'listen',
        children: [
          { index: true, element: <ListenPage /> },
          { path: ':materialId', element: <ListenSessionPage /> },
        ],
      },
      {
        path: 'vocabulary',
        children: [
          { index: true, element: <VocabularyPage /> },
          { path: 'review', element: <VocabularyReviewPage /> },
        ],
      },
      {
        path: 'sentences',
        children: [
          { index: true, element: <SentencesPage /> },
          { path: 'review', element: <SentencesReviewPage /> },
        ],
      },
      {
        path: 'materials',
        children: [
          { index: true, element: <MaterialsPage /> },
          { path: ':id', element: <MaterialDetailPage /> },
        ],
      },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
