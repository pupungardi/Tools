import React from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { ThemeMode } from '../../types';

interface Props {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  onCycleTheme: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onInstallPwa: () => void;
  onGoHome: () => void;
}

export const MobileHeader: React.FC<Props> = ({
  themeMode,
  resolvedTheme,
  onCycleTheme,
  onOpenSearch,
  onOpenMenu,
  onInstallPwa,
  onGoHome,
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-13 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Left: Wordmark "tools" + ☰ Hamburger menu */}
      <div className="flex items-center gap-3">
        <span
          onClick={onGoHome}
          className="cursor-pointer font-serif text-[26px] font-bold tracking-tight text-neutral-900 dark:text-neutral-100 select-none"
        >
          tools
        </span>
        <button
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <Menu className="h-5 w-5 stroke-[1.8]" />
        </button>
      </div>

      {/* Center Spacer */}
      <div className="flex-1" />

      {/* Right: Exactly 3 icons: 🔍 Search -> ⭳ Download/Install -> ☀︎ Theme toggle */}
      <div className="flex items-center gap-0.5">
        {/* 1. Search */}
        <button
          onClick={onOpenSearch}
          aria-label="Search tools"
          className="flex h-10 w-10 items-center justify-center rounded text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <Search className="h-5 w-5 stroke-[1.8]" />
        </button>

        {/* 2. Download / Install (Tray with down arrow) */}
        <button
          onClick={onInstallPwa}
          aria-label="Install as app"
          className="flex h-10 w-10 items-center justify-center rounded text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <svg
            className="h-5 w-5 stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* 3. Theme toggle (Sun icon) */}
        <button
          onClick={onCycleTheme}
          aria-label="Toggle theme mode"
          className="flex h-10 w-10 items-center justify-center rounded text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <Sun className="h-5 w-5 stroke-[1.8]" />
        </button>
      </div>
    </header>
  );
};
