import { useLiveMaterials } from '@/hooks/useLiveQuery';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { getLanguageFlag, getLanguageName } from '@/utils/languages';
import { formatDuration } from '@/utils/format';
import { FolderOpen, Clock, MessageSquare, Mic, Headphones } from 'lucide-react';
import type { Material, LanguageCode } from '@/models';
import { ALL_LANGUAGES } from '@/constants/languages';
import { useState } from 'react';

export function MaterialsPage() {
  const materials = useLiveMaterials();
  const [langFilter, setLangFilter] = useState<LanguageCode | 'all'>('all');

  if (!materials) return <LoadingSpinner className="py-20" />;

  const filtered = langFilter === 'all' ? materials : materials.filter(m => m.language === langFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">素材库</h2>
        <p className="mt-1 text-sm text-slate-500">浏览和管理学习素材</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={langFilter === 'all' ? 'primary' : 'default'} className="cursor-pointer" onClick={() => setLangFilter('all')}>全部</Badge>
        {ALL_LANGUAGES.map(lang => (
          <Badge key={lang} variant={langFilter === lang ? 'primary' : 'default'} className="cursor-pointer" onClick={() => setLangFilter(lang)}>
            {getLanguageFlag(lang)} {getLanguageName(lang)}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FolderOpen className="h-12 w-12" />} title="暂无素材" description="素材库为空" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((material: Material) => (
            <Card key={material.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/materials/${material.id}`} className="font-semibold hover:text-indigo-600 line-clamp-1">{material.title}</Link>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{material.description}</p>
                  </div>
                  <span className="text-xl">{getLanguageFlag(material.language)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant="primary">{material.level}</Badge>
                  <Badge>{material.topic}</Badge>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(material.duration)}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{material.sentenceCount}句</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link to={`/speak/${material.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1"><Mic className="h-3.5 w-3.5" />口语</Button>
                  </Link>
                  <Link to={`/listen/${material.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1"><Headphones className="h-3.5 w-3.5" />听力</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
