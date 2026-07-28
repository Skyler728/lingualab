import { useLiveMaterials } from '@/hooks/useLiveQuery';
import { useSettingsStore } from '@/stores';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { getLanguageFlag, getLanguageName } from '@/utils/languages';
import { formatDuration } from '@/utils/format';
import { Headphones, Clock, MessageSquare } from 'lucide-react';
import type { Material } from '@/models';

export function ListenPage() {
  const { settings } = useSettingsStore();
  const materials = useLiveMaterials(settings?.primaryLanguage);
  const primaryLang = settings?.primaryLanguage ?? 'en';

  if (!materials) return <LoadingSpinner className="py-20" />;

  const filteredMaterials = (materials ?? []).filter((m: Material) => m.language === primaryLang);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">听力练习</h2>
        <p className="mt-1 text-sm text-slate-500">听音频，回答问题，提升听力理解能力</p>
      </div>

      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={<Headphones className="h-12 w-12" />}
          title="暂无听力素材"
          description={`还没有${getLanguageName(primaryLang)}的练习素材`}
          action={<Link to="/materials"><Button>去素材库</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material: Material) => (
            <Link key={material.id} to={`/listen/${material.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{material.title}</h3>
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
