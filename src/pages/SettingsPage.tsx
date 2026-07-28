import { useSettingsStore, useUIStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getLanguageFlag, getLanguageName } from '@/utils/languages';
import { ALL_LANGUAGES } from '@/constants/languages';
import { Settings, Download, Upload, Trash2, Languages, Mic, Target, Palette } from 'lucide-react';
import type { LanguageCode } from '@/models';
import { db } from '@/db';

export function SettingsPage() {
  const { settings, loaded, updateSettings } = useSettingsStore();
  const { addToast } = useUIStore();

  if (!loaded || !settings) return <LoadingSpinner className="py-20" />;

  const handleExport = async () => {
    const data = {
      materials: await db.materials.toArray(),
      sentences: await db.sentences.toArray(),
      wordCards: await db.wordCards.toArray(),
      sentenceCards: await db.sentenceCards.toArray(),
      settings: await db.settings.get(1),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `lingualab-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    addToast('数据导出成功', 'success');
  };

  const handleClear = async () => {
    if (!confirm('确定要清除所有数据吗？此操作不可撤销！')) return;
    await db.materials.clear();
    await db.sentences.clear();
    await db.wordCards.clear();
    await db.sentenceCards.clear();
    await db.speakingAttempts.clear();
    await db.listeningSessions.clear();
    await db.listeningAnswers.clear();
    await db.dailyStats.clear();
    addToast('所有数据已清除', 'info');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div><h2 className="text-xl font-bold">设置</h2><p className="text-sm text-slate-500">管理语言偏好和学习目标</p></div>

      {/* Language */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Languages className="h-4 w-4" /> 语言设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">主要学习语言</label>
            <Select
              value={settings.primaryLanguage}
              onChange={(e) => updateSettings({ primaryLanguage: e.target.value as LanguageCode })}
              options={ALL_LANGUAGES.map(l => ({ value: l, label: `${getLanguageFlag(l)} ${getLanguageName(l)}` }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">学习语言</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_LANGUAGES.map(lang => {
                const active = settings.learningLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      const newLangs = active
                        ? settings.learningLanguages.filter(l => l !== lang)
                        : [...settings.learningLanguages, lang];
                      updateSettings({ learningLanguages: newLangs });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      active ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-400' : 'border-slate-200 text-slate-500 dark:border-slate-700'
                    }`}
                  >
                    {getLanguageFlag(lang)} {getLanguageName(lang)}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mic className="h-4 w-4" /> 语音设置</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">语速 ({settings.speechRate}x)</label>
            <input type="range" min="0.5" max="2" step="0.1" value={settings.speechRate}
              onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
              className="mt-2 w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Edge-TTS 服务地址（用于粤语）</label>
            <Input placeholder="http://localhost:5050" value={settings.edgeTTSEndpoint ?? ''}
              onChange={(e) => updateSettings({ edgeTTSEndpoint: e.target.value || undefined })} />
            <p className="mt-1 text-xs text-slate-400">粤语语音需要本地运行 edge-tts 服务</p>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4" /> 每日目标</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">每日单词复习</label><Input type="number" value={settings.dailyWordGoal} onChange={(e) => updateSettings({ dailyWordGoal: parseInt(e.target.value) || 20 })} /></div>
          <div><label className="text-sm font-medium">每日句子复习</label><Input type="number" value={settings.dailySentenceGoal} onChange={(e) => updateSettings({ dailySentenceGoal: parseInt(e.target.value) || 10 })} /></div>
          <div><label className="text-sm font-medium">每日口语练习</label><Input type="number" value={settings.dailySpeakingGoal} onChange={(e) => updateSettings({ dailySpeakingGoal: parseInt(e.target.value) || 5 })} /></div>
          <div><label className="text-sm font-medium">每日听力练习</label><Input type="number" value={settings.dailyListeningGoal} onChange={(e) => updateSettings({ dailyListeningGoal: parseInt(e.target.value) || 3 })} /></div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> 数据管理</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />导出数据</Button>
          <Button variant="danger" onClick={handleClear} className="gap-2"><Trash2 className="h-4 w-4" />清除所有数据</Button>
        </CardContent>
      </Card>
    </div>
  );
}
