import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useResumeStore } from '@/store/resume';
import { useUIStore } from '@/store/ui';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import { useSaveShortcut } from '@/hooks/useSaveShortcut';
import { Toolbar, FloatingToolbar } from '@/components/Toolbar';
import { ResumeView } from '@/components/Resume';
import { MenuPanel } from '@/components/MenuPanel';
import { Toaster } from '@/components/ui/sonner';
import { AdSlot, useAdScripts } from '@/components/ads/AdSlot';
import { Menu } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const Editor = lazy(() =>
  import('@/components/Editor').then((m) => ({ default: m.Editor })),
);

const Agentation = lazy(() =>
  import('agentation').then((m) => ({ default: m.Agentation })),
);

function DevAgentation() {
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Suspense>
      <Agentation />
    </Suspense>
  );
}

function App() {
  const { config, loading, error, load } = useResumeStore();
  const menuPanelOpen = useUIStore((s) => s.menuPanelOpen);
  const openMenuPanel = useUIStore((s) => s.openMenuPanel);
  const { t } = useTranslation();
  useThemeEffect();
  useSaveShortcut();
  useAdScripts();

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error ?? t('common.loadError')}</p>
        <Button size="sm" onClick={() => load()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Toolbar />
        <div
          className="contents"
          aria-hidden={menuPanelOpen || undefined}
          {...(menuPanelOpen ? { inert: '' } : {})}
        >
          <main className="flex flex-1 justify-center gap-4 overflow-auto py-8 [overflow-anchor:none] print:overflow-visible print:py-0">
            <div className="hidden shrink-0 xl:block print:hidden">
              <AdSlot slot="sidebar160x600" />
              <div className="mt-4">
                <AdSlot slot="sidebar160x300" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-center gap-4">
              <AdSlot slot="betweenToolContent728x90" className="w-full max-w-[728px] justify-center print:hidden" />
              <ResumeView config={config} />
              <AdSlot slot="content468x60" className="print:hidden" />
              <AdSlot slot="nativeBelowResult" className="print:hidden" />
              <AdSlot slot="content300x250" className="print:hidden" />
            </div>
          </main>
          <FloatingToolbar />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed bottom-4 left-4 z-40 rounded-2xl border bg-white/90 text-muted-foreground shadow-lg backdrop-blur hover:text-foreground print:hidden"
                onClick={openMenuPanel}
                aria-label={t('common.menu')}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('common.menu')}</TooltipContent>
          </Tooltip>
          <Suspense>
            <Editor />
          </Suspense>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white/90 pb-1 pt-1 shadow md:hidden print:hidden">
          <AdSlot slot="mobileSticky320x50" />
        </div>
        <MenuPanel />
        <Toaster />
        <DevAgentation />
      </div>
    </TooltipProvider>
  );
}

export default App;
