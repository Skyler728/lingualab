import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/stores';
import { Menu, Sun, Moon, Monitor } from 'lucide-react';
import { useSettingsStore } from '@/stores';
import { cn } from '@/utils/cn';

const pageTitles: Record<string, string> = {
  '/': '仪表盘',
  '/speak': '口语练习',
  '/listen': '听力练习',
  '/vocabulary': '词汇本',
  '/sentences': '句子库',
  '/materials': '素材库',
  '/settings': '设置',
};

export function TopBar() {
  const location = useLocation();
  const { toggleSidebar } = useUIStore();
  const { settings, updateSettings } = useSettingsStore();

  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const title = pageTitles[basePath] || 'LinguaLab';

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const current = settings?.theme ?? 'system';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    updateSettings({ theme: next });
  };

  const ThemeIcon = settings?.theme === 'dark' ? Moon : settings?.theme === 'light' ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <button onClick={toggleSidebar} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={cycleTheme}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          title={`当前: ${settings?.theme === 'system' ? '跟随系统' : settings?.theme === 'dark' ? '深色' : '浅色'}`}
        >
          <ThemeIcon className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}
