import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { seedDatabase } from '@/db/seeds';
import { useLiveMaterials, useDueWordCardsCount, useDueSentenceCardsCount } from '@/hooks/useLiveQuery';
import { useSettingsStore } from '@/stores';
import { getLanguageFlag } from '@/utils/languages';
import { formatRelativeTime } from '@/utils/format';
import { db } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Mic, Headphones, BookOpen, Quote, Flame, Clock, TrendingUp, Target } from 'lucide-react';
import type { SpeakingAttempt, ListeningSession } from '@/models';

export function DashboardPage() {
  const { settings, loaded } = useSettingsStore();
  const materials = useLiveMaterials();
  const dueWords = useDueWordCardsCount();
  const dueSentences = useDueSentenceCardsCount();

  const recentSpeaking = useLiveQuery(() =>
    db.speakingAttempts.orderBy('createdAt').reverse().limit(5).toArray()
  );

  const recentListening = useLiveQuery(() =>
    db.listeningSessions.orderBy('completedAt').reverse().limit(5).toArray()
  );

  const totalWords = useLiveQuery(() => db.wordCards.count());
  const totalSentences = useLiveQuery(() => db.sentenceCards.count());

  useEffect(() => {
    if (loaded) {
      seedDatabase();
    }
  }, [loaded]);

  if (!loaded) return <LoadingSpinner className="py-20" />;

  const primaryLang = settings?.primaryLanguage ?? 'en';
  const todayKey = new Date().toISOString().split('T')[0];

  const stats = [
    { label: '词汇总量', value: totalWords ?? 0, icon: BookOpen, color: 'text-indigo-600' },
    { label: '句子收藏', value: totalSentences ?? 0, icon: Quote, color: 'text-emerald-600' },
    { label: '待复习单词', value: dueWords ?? 0, icon: Clock, color: 'text-amber-600' },
    { label: '待复习句子', value: dueSentences ?? 0, icon: Target, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold">开始口语练习</h3>
              <p className="mt-1 text-sm text-slate-500">影子跟读，提升发音和流利度</p>
            </div>
            <Link to="/speak">
              <Button size="lg" className="gap-2">
                <Mic className="h-5 w-5" /> 开始
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold">开始听力练习</h3>
              <p className="mt-1 text-sm text-slate-500">精听训练，理解真实对话</p>
            </div>
            <Link to="/listen">
              <Button size="lg" variant="secondary" className="gap-2">
                <Headphones className="h-5 w-5" /> 开始
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-amber-500" />
              今日复习任务
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueWords !== undefined && dueWords > 0 ? (
              <Link to="/vocabulary/review" className="flex items-center justify-between rounded-lg bg-amber-50 p-3 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/30">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-medium">单词复习</p>
                    <p className="text-xs text-slate-500">{dueWords} 个单词待复习</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">去复习</Button>
              </Link>
            ) : (
              <p className="text-sm text-slate-400 py-2">暂无待复习单词 🎉</p>
            )}
            {dueSentences !== undefined && dueSentences > 0 ? (
              <Link to="/sentences/review" className="flex items-center justify-between rounded-lg bg-rose-50 p-3 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30">
                <div className="flex items-center gap-3">
                  <Quote className="h-5 w-5 text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">句子复习</p>
                    <p className="text-xs text-slate-500">{dueSentences} 个句子待复习</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">去复习</Button>
              </Link>
            ) : (
              <p className="text-sm text-slate-400 py-2">暂无待复习句子 🎉</p>
            )}
            {((dueWords ?? 0) === 0 && (dueSentences ?? 0) === 0) && (
              <p className="text-sm text-slate-400 text-center py-2">全部完成！真棒 👏</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              最近活动
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!recentSpeaking || recentSpeaking.length === 0) && (!recentListening || recentListening.length === 0) ? (
              <p className="text-sm text-slate-400 py-4 text-center">还没有练习记录，开始你的第一次练习吧！</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentSpeaking?.slice(0, 3).map((a: SpeakingAttempt) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-lg p-2 text-sm">
                    <Mic className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span className="flex-1 truncate">口语练习 — "{a.referenceText.slice(0, 30)}..."</span>
                    <span className="text-xs text-slate-400">{formatRelativeTime(a.createdAt)}</span>
                    <span className="text-xs font-medium text-indigo-600">{a.score}分</span>
                  </div>
                ))}
                {recentListening?.slice(0, 3).map((s: ListeningSession) => (
                  <div key={s.id} className="flex items-center gap-2 rounded-lg p-2 text-sm">
                    <Headphones className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="flex-1 truncate">听力练习 — {s.correctAnswers}/{s.totalQuestions} 正确</span>
                    <span className="text-xs text-slate-400">{formatRelativeTime(s.completedAt)}</span>
                    <span className="text-xs font-medium text-emerald-600">{s.score}分</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
