import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { useSettingsStore, useUIStore } from '@/stores';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLeft, Quote } from 'lucide-react';
import type { SentenceCard } from '@/models';

type Rating = 1 | 2 | 3 | 4;

export function SentencesReviewPage() {
  const navigate = useNavigate();
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();
  const primaryLang = settings?.primaryLanguage ?? 'en';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [finished, setFinished] = useState(false);

  const dueCards = useLiveQuery(async () => {
    const now = Date.now();
    const all = await db.sentenceCards.where('due').below(now).toArray();
    return all.filter(c => c.language === primaryLang);
  }, [primaryLang]);

  if (!dueCards) return <LoadingSpinner className="py-20" />;

  if (dueCards.length === 0 || finished) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sentences')}><ArrowLeft className="h-4 w-4" /></Button>
          <h2 className="font-semibold">句子复习</h2>
        </div>
        <EmptyState icon={<Quote className="h-12 w-12" />} title={finished ? '复习完成！' : '暂无待复习句子'} description={finished ? `已完成 ${reviewed} 个句子的复习` : '所有句子都复习过了'} action={<Button onClick={() => navigate('/sentences')}>返回句子库</Button>} />
      </div>
    );
  }

  const currentCard = dueCards[currentIdx];

  const handleRate = async (rating: Rating) => {
    const intervals: Record<Rating, number> = { 1: 1, 2: 600, 3: 86400, 4: 259200 };
    const now = Date.now();
    const newState = rating === 1 ? 'Relearning' : currentCard.state === 'New' ? 'Learning' : 'Review';

    await db.sentenceCards.update(currentCard.id, {
      state: newState, due: now + intervals[rating] * 1000,
      reps: currentCard.reps + 1, lapses: rating === 1 ? currentCard.lapses + 1 : currentCard.lapses,
      lastReview: now, updatedAt: now,
    });

    setReviewed(r => r + 1);
    setShowBack(false);

    if (currentIdx < dueCards.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
      addToast(`复习完成！共 ${reviewed + 1} 个句子`, 'success');
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/sentences')}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1"><h2 className="font-semibold">句子复习</h2><p className="text-xs text-slate-500">{currentIdx + 1}/{dueCards.length}</p></div>
        <Badge variant="primary">{reviewed} 已复习</Badge>
      </div>
      <ProgressBar value={(currentIdx / dueCards.length) * 100} size="sm" />

      <Card className="min-h-[250px] cursor-pointer border-2 border-rose-100 dark:border-rose-900/50" onClick={() => setShowBack(true)}>
        <CardContent className="flex flex-col items-center justify-center p-8 min-h-[250px]">
          {!showBack ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-400">点击卡片查看翻译</p>
              <p className="text-xl font-medium">{currentCard.text}</p>
              <p className="text-xs text-slate-400">{currentCard.source}</p>
            </div>
          ) : (
            <div className="text-center space-y-4 w-full">
              <p className="text-xl font-medium">{currentCard.text}</p>
              <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />
              {currentCard.translation && <p className="text-lg text-indigo-600 dark:text-indigo-400">{currentCard.translation}</p>}
              {currentCard.notes && <p className="text-sm text-slate-500">📝 {currentCard.notes}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {showBack && (
        <div className="grid grid-cols-4 gap-2">
          <Button variant="danger" onClick={() => handleRate(1)} className="flex-col py-3"><span className="text-lg">😰</span><span className="text-xs">忘记</span></Button>
          <Button variant="secondary" onClick={() => handleRate(2)} className="flex-col py-3"><span className="text-lg">🤔</span><span className="text-xs">困难</span></Button>
          <Button variant="primary" onClick={() => handleRate(3)} className="flex-col py-3"><span className="text-lg">😊</span><span className="text-xs">一般</span></Button>
          <Button variant="primary" onClick={() => handleRate(4)} className="flex-col py-3 bg-emerald-600 hover:bg-emerald-700"><span className="text-lg">🚀</span><span className="text-xs">简单</span></Button>
        </div>
      )}
    </div>
  );
}
