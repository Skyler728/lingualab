import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores';
import {
  LayoutDashboard, Mic, Headphones, BookOpen, Quote, FolderOpen, Settings, ChevronLeft, Languages
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/speak', icon: Mic, label: '口语练习' },
  { to: '/listen', icon: Headphones, label: '听力练习' },
  { to: '/vocabulary', icon: BookOpen, label: '词汇本' },
  { to: '/sentences', icon: Quote, label: '句子库' },
  { to: '/materials', icon: FolderOpen, label: '素材库' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-slate-200 px-3 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <Languages className="h-6 w-6 flex-shrink-0 text-indigo-600" />
          {sidebarOpen && <span className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap">LinguaLab</span>}
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform text-slate-400', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                !sidebarOpen && 'justify-center px-2'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <p className="text-xs text-slate-400">v1.0.0 — 语言学习工作台</p>
        </div>
      )}
    </aside>
  );
}
