import React, { useState, useRef, useEffect } from 'react';
import { ThemeMode } from '../types';
import { Download, Check, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

interface Props {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenShortcuts: () => void;
  onOpenCommandPalette: () => void;
  onOpenPrivacy: () => void;
  onResetLayout: () => void;
  onSelectTool: (toolId: string) => void;
  onInstallPwa: () => void;
  canInstallPwa: boolean;
}

export const TopBar: React.FC<Props> = ({
  themeMode,
  onThemeChange,
  onOpenShortcuts,
  onOpenCommandPalette,
  onOpenPrivacy,
  onResetLayout,
  onSelectTool,
  onInstallPwa,
  canInstallPwa,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [modeDropdown, setModeDropdown] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header
      ref={menuRef}
      className="relative z-30 flex h-10 select-none items-center justify-between border-b border-neutral-300 bg-neutral-100/90 px-3 text-xs backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90"
    >
      {/* Left: Brand + Desktop Menu Bar */}
      <div className="flex items-center gap-4">
        {/* Wordmark logo */}
        <div
          onClick={onResetLayout}
          className="flex cursor-pointer items-center gap-1.5 font-wordmark text-base tracking-tight text-neutral-900 dark:text-white"
        >
          <span>tools</span>
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-neutral-500 font-normal">
            desk
          </span>
        </div>

        {/* Desktop Menu: File · View · Tools · Language · Help */}
        <nav className="hidden items-center gap-0.5 sm:flex">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`rounded px-2.5 py-1 text-neutral-700 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 ${
                activeMenu === 'file' ? 'bg-neutral-200 dark:bg-neutral-800' : ''
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute left-0 mt-1 w-48 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  onClick={() => {
                    onResetLayout();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>New Workbench Session</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">Esc</span>
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Flush Local Memory</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘R</span>
                </button>
                <hr className="my-1 border-neutral-200 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    onResetLayout();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Restore Layout</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘\</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`rounded px-2.5 py-1 text-neutral-700 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 ${
                activeMenu === 'view' ? 'bg-neutral-200 dark:bg-neutral-800' : ''
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute left-0 mt-1 w-48 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  onClick={() => {
                    onResetLayout();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Toggle Browser Panel</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘1</span>
                </button>
                <button
                  onClick={() => {
                    onResetLayout();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Toggle Inspector Panel</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘2</span>
                </button>
                <hr className="my-1 border-neutral-200 dark:border-neutral-800" />
                <button
                  onClick={() => {
                    onOpenCommandPalette();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Command Palette</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘K</span>
                </button>
              </div>
            )}
          </div>

          {/* Tools Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'tools' ? null : 'tools')}
              className={`rounded px-2.5 py-1 text-neutral-700 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 ${
                activeMenu === 'tools' ? 'bg-neutral-200 dark:bg-neutral-800' : ''
              }`}
            >
              Tools
            </button>
            {activeMenu === 'tools' && (
              <div className="absolute left-0 mt-1 w-52 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  onClick={() => {
                    onSelectTool('compress-pdf');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ Compress PDF</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">01</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('audio-tone-generator');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ Audio Tone Generator</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">02</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('image-resizer');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ Image Resizer & Scaler</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">04</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('json-formatter');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ JSON Formatter & Validator</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">05</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('password-generator');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ Password & Entropy Meter</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">06</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('contrast-checker');
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>★ WCAG Contrast Checker</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">10</span>
                </button>
              </div>
            )}
          </div>

          {/* Language Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'lang' ? null : 'lang')}
              className={`rounded px-2.5 py-1 text-neutral-700 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 ${
                activeMenu === 'lang' ? 'bg-neutral-200 dark:bg-neutral-800' : ''
              }`}
            >
              Language
            </button>
            {activeMenu === 'lang' && (
              <div className="absolute left-0 mt-1 w-44 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  <span>English (Default)</span>
                  <Check className="h-3.5 w-3.5 text-neutral-800 dark:text-neutral-200" />
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <span>Bahasa Indonesia</span>
                  <span className="text-[10px] font-mono-tech text-neutral-400">ID</span>
                </div>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className={`rounded px-2.5 py-1 text-neutral-700 transition hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 ${
                activeMenu === 'help' ? 'bg-neutral-200 dark:bg-neutral-800' : ''
              }`}
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute left-0 mt-1 w-52 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  onClick={() => {
                    onOpenShortcuts();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Keyboard Shortcuts</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">⌘/</span>
                </button>
                <button
                  onClick={() => {
                    onOpenPrivacy();
                    setActiveMenu(null);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>Privacy Architecture</span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">Info</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right: Install PWA + Theme Mode dropdown */}
      <div className="flex items-center gap-2">
        {/* Install Button */}
        <button
          onClick={onInstallPwa}
          title="Install as Progressive Web App"
          className="flex items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-mono-tech text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
        >
          <Download className="h-3 w-3" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {/* Mode Toggle (Light / Dark / System) with checkmark on active */}
        <div className="relative">
          <button
            onClick={() => setModeDropdown(!modeDropdown)}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-mono-tech text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
          >
            {themeMode === 'light' ? (
              <Sun className="h-3 w-3 text-amber-500" />
            ) : themeMode === 'dark' ? (
              <Moon className="h-3 w-3 text-sky-400" />
            ) : (
              <Monitor className="h-3 w-3 text-neutral-500" />
            )}
            <span className="capitalize">{themeMode}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {modeDropdown && (
            <div className="absolute right-0 mt-1 w-36 rounded border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = themeMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onThemeChange(m.id as ThemeMode);
                      setModeDropdown(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{m.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-neutral-900 dark:text-neutral-100" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
