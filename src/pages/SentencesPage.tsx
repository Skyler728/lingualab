import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveSentenceCards } from '@/hooks/useLiveQuery';
import { useSettingsStore, useUIStore } from '@/stores';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { db } from '@/db';
import { getLanguageName } from '@/utils/languages';
import { formatRelativeTime } from '@/utils/format';
import { v4 as uuid } from 'uuid';
import { Quote, Plus, Search, Brain, Trash2 } from 'lucide-react';
import type { SentenceCard as SentenceCardType } from '@/models';

export function SentencesPage() {
  const { settings } = useSettingsStore();
  const { addToast } = useUIStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const primaryLang = settings?.primaryLanguage ?? 'en';

  const sentenceCards = useLiveSentenceCards(primaryLang, activeTab !== 'all' ? activeTab : undefined);

  const [form, setForm] = useState({ text: '', translation: '', source: '', notes: '' });

  const handleAdd = async () => {
    if (!form.text) { addToast('请填写句子内容', 'error'); return; }
    const now = Date.now();
    await db.sentenceCards.put({
      id: uuid(), text: form.text, translation: form.translation || undefined,
      source: form.source || '手动添加', language: primaryLang, notes: form.notes || undefined,
      state: 'New', due: now, stability: 0, difficulty: 0, elapsedDays: 0,
      scheduledDays: 0, reps: 0, lapses: 0, createdAt: now, updatedAt: now,
    });
    setForm({ text: '', translation: '', source: '', notes: '' });
    setShowForm(false);
    addToast('句子已添加', 'success');
  };

  const handleDelete = async (id: string) => {
    await db.sentenceCards.delete(id);
    addToast('句子已删除', 'info');
  };

  const filteredCards = (sentenceCards ?? []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.text.toLowerCase().includes(q) || (c.translation ?? '').toLowerCase().includes(q);
  });

  const stateBadgeVariant: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    New: 'warning', Learning: 'primary', Review: 'success', Relearning: 'danger',
  };
  const stateLabel: Record<string, string> = {
    New: '新学', Learning: '学习中', Review: '待复习', Relearning: '重学',
  };

  const tabs = [
    { id: 'all', label: '全部', content: null },
    { id: 'New', label: '新学', content: null },
    { id: 'Learning', label: '学习中', content: null },
    { id: 'Review', label: '待复习', content: null },
  ];

  if (!sentenceCards) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">句子库</h2>
          <p className="text-sm text-slate-500">{getLanguageName(primaryLang)} · {sentenceCards.length} 个句子</p>
        </div>
        <div className="flex gap-2">
          <Link to="/sentences/review">
            <Button variant="outline" className="gap-2"><Brain className="h-4 w-4" /> 开始复习</Button>
          </Link>
          <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" /> 添加句子</Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="搜索句子..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Tabs tabs={tabs} onChange={setActiveTab} />

      {filteredCards.length === 0 ? (
        <EmptyState icon={<Quote className="h-12 w-12" />} title="还没有句子" description="开始收藏你喜欢的句子吧" action={<Button onClick={() => setShowForm(true)}>添加句子</Button>} />
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card: SentenceCardType) => (
            <Card key={card.id} className="group">
              <CardContent className="flex items-start gap-4 p-4">
                <Quote className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{card.text}</p>
                  {card.translation && <p className="mt-1 text-xs text-slate-500">{card.translation}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={stateBadgeVariant[card.state]}>{stateLabel[card.state]}</Badge>
                    <span className="text-xs text-slate-400">{card.source}</span>
                    <span className="text-xs text-slate-400">{formatRelativeTime(card.createdAt)}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="添加句子">
        <div className="space-y-4">
          <div><label className="text-sm font-medium">句子 *</label><Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="输入句子..." rows={2} /></div>
          <div><label className="text-sm font-medium">翻译</label><Input value={form.translation} onChange={(e) => setForm({ ...form, translation: e.target.value })} placeholder="中文翻译" /></div>
          <div><label className="text-sm font-medium">来源</label><Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="例如：TED演讲、电影台词" /></div>
          <div><label className="text-sm font-medium">笔记</label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="个人笔记..." rows={2} /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>取消</Button><Button onClick={handleAdd}>添加</Button></div>
        </div>
      </Modal>
    </div>
  );
}
