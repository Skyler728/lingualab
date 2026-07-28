import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '@/components/ui/Toast';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { useSettingsStore, useUIStore } from '@/stores';
import { useEffect } from 'react';
import { cn } from '@/utils/cn';

export function AppLayout() {
  const { sidebarOpen } = useUIStore();
  const { settings, loaded, loadSettings } = useSettingsStore();

  useEffect(() => {
    if (!loaded) loadSettings();
  }, [loaded, loadSettings]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (settings?.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings?.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [settings?.theme]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className={cn('transition-all duration-300', sidebarOpen ? 'lg:ml-60' : 'lg:ml-16')}>
        <TopBar />
        <main className="p-4 pb-20 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <PWAInstallPrompt />
      <ToastContainer />
    </div>
  );
}
