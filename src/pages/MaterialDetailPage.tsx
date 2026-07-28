import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getLanguageFlag, getLanguageName } from '@/utils/languages';
import { formatDuration } from '@/utils/format';
import { ArrowLeft, Mic, Headphones, Clock, MessageSquare } from 'lucide-react';
import type { Sentence } from '@/models';

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const material = useLiveQuery(() => id ? db.materials.get(id) : null, [id]);
  const sentences = useLiveQuery(() => id ? db.sentences.where('materialId').equals(id).sortBy('order') : null, [id]);

  if (!material || !sentences) return <LoadingSpinner className="py-20" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/materials')}>
        <ArrowLeft className="h-4 w-4 mr-1" /> 返回素材库
      </Button>

      <div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLanguageFlag(material.language)}</span>
          <h2 className="text-2xl font-bold">{material.title}</h2>
        </div>
        <p className="mt-2 text-slate-500">{material.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="primary">{material.level}</Badge>
          <Badge>{material.topic}</Badge>
          <Badge>{getLanguageName(material.language)}</Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{formatDuration(material.duration)}</span>
          <span className="text-xs text-slate-400 flex items-center gap-1"><MessageSquare className="h-3 w-3" />{material.sentenceCount}句</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to={`/speak/${material.id}`}>
          <Button className="gap-2"><Mic className="h-4 w-4" />口语练习</Button>
        </Link>
        <Link to={`/listen/${material.id}`}>
          <Button variant="outline" className="gap-2"><Headphones className="h-4 w-4" />听力练习</Button>
        </Link>
      </div>

      <div>
        <h3 className="font-semibold mb-3">句子列表 ({sentences.length})</h3>
        <div className="space-y-2">
          {sentences.map((s: Sentence) => (
            <Card key={s.id}>
              <CardContent className="flex items-start gap-3 p-3">
                <span className="text-xs text-slate-400 font-mono mt-0.5">{s.order + 1}</span>
                <div className="flex-1">
                  <p className="text-sm">{s.text}</p>
                  {s.translation && <p className="text-xs text-slate-400 mt-0.5">{s.translation}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
