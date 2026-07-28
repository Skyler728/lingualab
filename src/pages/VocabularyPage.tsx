import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveWordCards } from '@/hooks/useLiveQuery';
import { useSettingsStore, useUIStore } from '@/stores';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { db } from '@/db';
import { getLanguageFlag, getLanguageName } from '@/utils/languages';
import { formatRelativeTime } from '@/utils/format';
import { v4 as uuid } from 'uuid';
import { BookOpen, Plus, Search, Clock, CheckCircle, Brain, Trash2 } from 'lucide-react';
import type { LanguageCode, WordCard as WordCardType } from '@/models';

export function VocabularyPage() {
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const primaryLang = settings?.primaryLanguage ?? 'en';

  const wordCards = useLiveWordCards(primaryLang, activeTab !== 'all' ? activeTab : undefined);

  const [form, setForm] = useState({ word: '', reading: '', definition: '', examples: '', notes: '' });

  const handleAddWord = async () => {
    if (!form.word || !form.definition) {
      addToast('请填写单词和释义', 'error');
      return;
    }
    const now = Date.now();
    const card: WordCardType = {
      id: uuid(),
      word: form.word,
      reading: form.reading || undefined,
      definition: form.definition,
      examples: form.examples ? form.examples.split('\n').filter(Boolean) : [],
      notes: form.notes || undefined,
      language: primaryLang,
      state: 'New',
      due: now,
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      createdAt: now,
      updatedAt: now,
    };
    await db.wordCards.put(card);
    setForm({ word: '', reading: '', definition: '', examples: '', notes: '' });
    setShowForm(false);
    addToast('单词已添加', 'success');
  };

  const handleDelete = async (id: string) => {
    await db.wordCards.delete(id);
    addToast('单词已删除', 'info');
  };

  const filteredCards = (wordCards ?? []).filter((c: WordCardType) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.word.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q);
  });

  const stateBadgeVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    New: 'warning',
    Learning: 'primary',
    Review: 'success',
    Relearning: 'danger',
  };

  const stateLabel: Record<string, string> = {
    New: '新学',
    Learning: '学习中',
    Review: '待复习',
    Relearning: '重学',
  };

  const tabs = [
    { id: 'all', label: '全部', content: null },
    { id: 'New', label: '新学', content: null },
    { id: 'Learning', label: '学习中', content: null },
    { id: 'Review', label: '待复习', content: null },
    { id: 'Relearning', label: '重学', content: null },
  ];

  if (!wordCards) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">词汇本</h2>
          <p className="text-sm text-slate-500">{getLanguageName(primaryLang)} · {wordCards.length} 个单词</p>
        </div>
        <div className="flex gap-2">
          <Link to="/vocabulary/review">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" /> 开始复习
            </Button>
          </Link>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> 添加单词
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="搜索单词或释义..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs tabs={tabs} onChange={setActiveTab} />

      {filteredCards.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="还没有单词"
          description="开始添加你的第一个单词吧"
          action={<Button onClick={() => setShowForm(true)}>添加单词</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card: WordCardType) => (
            <Card key={card.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{card.word}</h3>
                      {card.reading && <span className="text-xs text-slate-400">[{card.reading}]</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{card.definition}</p>
                    {card.examples.length > 0 && (
                      <p className="mt-2 text-xs text-slate-400 line-clamp-1 italic">{card.examples[0]}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant={stateBadgeVariant[card.state]}>{stateLabel[card.state]}</Badge>
                  <span className="text-xs text-slate-400">{formatRelativeTime(card.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Word Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="添加单词">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">单词 *</label>
            <Input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} placeholder="输入单词" />
          </div>
          <div>
            <label className="text-sm font-medium">音标/读音</label>
            <Input value={form.reading} onChange={(e) => setForm({ ...form, reading: e.target.value })} placeholder="音标或读音" />
          </div>
          <div>
            <label className="text-sm font-medium">释义 *</label>
            <Input value={form.definition} onChange={(e) => setForm({ ...form, definition: e.target.value })} placeholder="中文释义" />
          </div>
          <div>
            <label className="text-sm font-medium">例句（每行一个）</label>
            <Textarea value={form.examples} onChange={(e) => setForm({ ...form, examples: e.target.value })} placeholder="例句..." rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium">笔记</label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="个人笔记..." rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
            <Button onClick={handleAddWord}>添加</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
