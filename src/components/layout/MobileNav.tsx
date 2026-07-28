import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { LayoutDashboard, Mic, Headphones, BookOpen, FolderOpen } from 'lucide-react';

const mobileItems = [
  { to: '/', icon: LayoutDashboard, label: '首页' },
  { to: '/speak', icon: Mic, label: '口语' },
  { to: '/listen', icon: Headphones, label: '听力' },
  { to: '/vocabulary', icon: BookOpen, label: '词汇' },
  { to: '/materials', icon: FolderOpen, label: '素材' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
