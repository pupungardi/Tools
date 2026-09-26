import React, { useState, useEffect, useRef } from 'react';
import { ALL_TOOLS } from './data/toolsData';
import { ToolItem, MobileTab, ThemeMode } from './types';
import { useSystemMetrics } from './hooks/useSystemMetrics';
import { useTheme } from './hooks/useTheme';
import { TopBar } from './components/TopBar';
import { BrowserPanel } from './components/BrowserPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { DeskPanel } from './components/DeskPanel';
import { StatusBar } from './components/StatusBar';
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileBrowserView } from './components/mobile/MobileBrowserView';
import { MobileDeskView } from './components/mobile/MobileDeskView';
import { MobileInspectorView } from './components/mobile/MobileInspectorView';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileMenuSheet } from './components/mobile/MobileMenuSheet';
import { CommandPalette } from './components/CommandPalette';
import { ShortcutsModal } from './components/ShortcutsModal';
import { PrivacyModal } from './components/PrivacyModal';

export default function App() {
  const { themeMode, setThemeMode, resolvedTheme, cycleTheme } = useTheme();
  const metrics = useSystemMetrics();

  // Active Tool and navigation history
  const [activeToolId, setActiveToolId] = useState<string>('compress-pdf');
  const [history, setHistory] = useState<string[]>(['compress-pdf']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Desktop sidebar layouts
  const [browserWidth, setBrowserWidth] = useState<number>(260);
  const [isBrowserOpen, setIsBrowserOpen] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Total bytes exported during session
  const [filesOutBytes, setFilesOutBytes] = useState<number>(0);

  // Mobile state (< 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < 768);
  const [mobileTab, setMobileTab] = useState<MobileTab>('browse');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [pathCopied, setPathCopied] = useState<boolean>(false);

  // PWA install prompt reference
  const deferredPromptRef = useRef<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // Listen to screen width resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const choice = await deferredPromptRef.current.userChoice;
      if (choice.outcome === 'accepted') {
        setCanInstallPwa(false);
      }
      deferredPromptRef.current = null;
    } else {
      alert('PWA is ready: Tap "Share" or browser menu > "Add to Home Screen" / "Install tools" to run locally.');
    }
  };

  const activeTool = ALL_TOOLS.find((t) => t.id === activeToolId) || null;

  // Tool Selection handler with history recording
  const handleSelectTool = (id: string) => {
    if (!id) {
      setActiveToolId('');
      if (isMobile) setMobileTab('tool');
      return;
    }
    setActiveToolId(id);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(id);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);

    if (isMobile) {
      setMobileTab('tool');
    }
  };

  // Nav back/forward
  const handleNavBack = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setActiveToolId(history[nextIdx]);
    }
  };

  const handleNavForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setActiveToolId(history[nextIdx]);
    }
  };

  const handleCopyPath = () => {
    if (activeTool) {
      navigator.clipboard.writeText(activeTool.path);
      setPathCopied(true);
      setTimeout(() => setPathCopied(false), 2000);
    }
  };

  const handleResetLayout = () => {
    setBrowserWidth(260);
    setIsBrowserOpen(true);
    setIsInspectorOpen(true);
    setIsFullScreen(false);
  };

  // Global Keyboard Shortcuts (Section 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key;

      // 1. Command Palette: ⌘K
      if (isCmdOrCtrl && (key === 'k' || key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 2. Shortcuts overlay: ⌘/
      if (isCmdOrCtrl && key === '/') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 3. Toggle light/dark/system: ⌘⇧L
      if (isCmdOrCtrl && e.shiftKey && (key === 'l' || key === 'L')) {
        e.preventDefault();
        cycleTheme();
        return;
      }

      // 4. Copy path of active tool: ⌘⇧C
      if (isCmdOrCtrl && e.shiftKey && (key === 'c' || key === 'C')) {
        e.preventDefault();
        handleCopyPath();
        return;
      }

      // 5. Toggle Browser panel: ⌘1
      if (isCmdOrCtrl && key === '1') {
        e.preventDefault();
        setIsBrowserOpen((prev) => !prev);
        return;
      }

      // 6. Toggle Inspector panel: ⌘2
      if (isCmdOrCtrl && key === '2') {
        e.preventDefault();
        setIsInspectorOpen((prev) => !prev);
        return;
      }

      // 7. Fullscreen / maximize tool: F or ⌘\
      if ((isCmdOrCtrl && key === '\\') || (!isCmdOrCtrl && (key === 'f' || key === 'F') && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA')) {
        e.preventDefault();
        setIsFullScreen((prev) => {
          const next = !prev;
          if (next) {
            setIsBrowserOpen(false);
            setIsInspectorOpen(false);
          } else {
            setIsBrowserOpen(true);
            setIsInspectorOpen(true);
          }
          return next;
        });
        return;
      }

      // 8. Navigation Back/Forward: ⌘[ and ⌘]
      if (isCmdOrCtrl && key === '[') {
        e.preventDefault();
        handleNavBack();
        return;
      }
      if (isCmdOrCtrl && key === ']') {
        e.preventDefault();
        handleNavForward();
        return;
      }

      // 9. Close modals on Escape
      if (key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
        setIsPrivacyOpen(false);
        setIsMobileMenuOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, activeTool, cycleTheme]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-50 text-neutral-900 font-sans dark:bg-neutral-950 dark:text-neutral-100">
      {/* ============================================================== */}
      {/* RESPONSIVE LAYOUT SWITCH: MOBILE (<768px) vs DESKTOP (>=768px) */}
      {/* ============================================================== */}

      {isMobile ? (
        /* MOBILE VIEW (< 768px) - Strictly matches Section 6 */
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* A. Header atas */}
          <MobileHeader
            themeMode={themeMode}
            resolvedTheme={resolvedTheme}
            onCycleTheme={cycleTheme}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
            onOpenMenu={() => setIsMobileMenuOpen(true)}
            onInstallPwa={handleInstallPwa}
            onGoHome={() => setMobileTab('browse')}
          />

          {/* Body Content based on active mobile tab */}
          <div className="flex-1 overflow-y-auto">
            {mobileTab === 'browse' && (
              <MobileBrowserView
                activeToolId={activeToolId}
                onSelectTool={handleSelectTool}
                onOpenSearchModal={() => setIsCommandPaletteOpen(true)}
              />
            )}

            {mobileTab === 'tool' && (
              <MobileDeskView
                activeTool={activeTool}
                onSelectTool={handleSelectTool}
                onFileOut={(bytes) => setFilesOutBytes((prev) => prev + bytes)}
                onClearTool={() => setActiveToolId('')}
              />
            )}

            {mobileTab === 'info' && (
              <MobileInspectorView
                metrics={metrics}
                filesOutBytes={filesOutBytes}
              />
            )}
          </div>

          {/* E. Bottom navigation bar (EXACTLY 3 TABS: Browse, Tool, Info) */}
          <MobileBottomNav
            activeTab={mobileTab}
            onSelectTab={setMobileTab}
          />

          {/* Mobile Menu Sheet */}
          <MobileMenuSheet
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            themeMode={themeMode}
            onThemeChange={setThemeMode}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onInstallPwa={handleInstallPwa}
            onResetLayout={handleResetLayout}
          />
        </div>
      ) : (
        /* DESKTOP VIEW (>= 768px) - Strictly matches Section 2 */
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* A. Top Bar (menu desktop) */}
          <TopBar
            themeMode={themeMode}
            onThemeChange={setThemeMode}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onResetLayout={handleResetLayout}
            onSelectTool={handleSelectTool}
            onInstallPwa={handleInstallPwa}
            canInstallPwa={canInstallPwa}
          />

          {/* 3-Panel Main Area: Browser (left) + Desk (center) + Inspector (right) */}
          <div className="flex flex-1 overflow-hidden">
            {/* B. Panel Kiri — "Browser" */}
            {isBrowserOpen && (
              <BrowserPanel
                activeToolId={activeToolId}
                onSelectTool={handleSelectTool}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                width={browserWidth}
                onWidthChange={setBrowserWidth}
                onResetWidth={() => setBrowserWidth(260)}
              />
            )}

            {/* C. Panel Tengah — "Desk" */}
            <DeskPanel
              activeTool={activeTool}
              onSelectTool={handleSelectTool}
              filesOutBytes={filesOutBytes}
              onFileOut={(bytes) => setFilesOutBytes((prev) => prev + bytes)}
              onCopyPath={handleCopyPath}
              pathCopied={pathCopied}
            />

            {/* D. Panel Kanan — "Inspector" */}
            <InspectorPanel
              metrics={metrics}
              activeTool={activeTool}
              isOpen={isInspectorOpen}
              onToggle={() => setIsInspectorOpen((prev) => !prev)}
            />
          </div>

          {/* E. Status / Footer Bar */}
          <StatusBar
            filesOutBytes={filesOutBytes}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onRestoreLayout={handleResetLayout}
          />
        </div>
      )}

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={handleSelectTool}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
