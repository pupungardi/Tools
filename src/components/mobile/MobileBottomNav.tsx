import React from 'react';
import { MobileTab } from '../../types';

interface Props {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 w-full items-center justify-around border-t border-neutral-200 bg-white/95 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      {/* 1. Tab: Browse */}
      <button
        onClick={() => onSelectTab('browse')}
        className={`relative flex min-h-[48px] min-w-[72px] flex-col items-center justify-center transition ${
          activeTab === 'browse'
            ? 'text-neutral-950 dark:text-white font-medium'
            : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
        }`}
      >
        <div className="relative flex h-8 w-12 items-center justify-center">
          {/* Badge hitam berbentuk pil berisi total jumlah tool (106) muncul menempel di atas ikon saat tab ini aktif */}
          {activeTab === 'browse' && (
            <span className="absolute -top-1.5 z-20 flex h-4 items-center justify-center rounded-full bg-neutral-950 px-1.5 font-sans text-[9px] font-bold leading-none tracking-tight text-white shadow-sm dark:bg-white dark:text-neutral-950">
              106
            </span>
          )}
          <div
            className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
              activeTab === 'browse'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : ''
            }`}
          >
            {/* Ikon garis bertumpuk (stacked lines) */}
            <svg
              className="h-4.5 w-4.5 stroke-[2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </div>
        </div>
        <span className="mt-0.5 text-[11px] font-medium tracking-tight">Browse</span>
      </button>

      {/* 2. Tab: Tool */}
      <button
        onClick={() => onSelectTab('tool')}
        className={`relative flex min-h-[48px] min-w-[72px] flex-col items-center justify-center transition ${
          activeTab === 'tool'
            ? 'text-neutral-950 dark:text-white font-medium'
            : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
        }`}
      >
        <div className="flex h-8 w-12 items-center justify-center">
          <div
            className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
              activeTab === 'tool'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : ''
            }`}
          >
            {/* Ikon kotak / kartu workspace */}
            <svg
              className="h-4.5 w-4.5 stroke-[2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>
        </div>
        <span className="mt-0.5 text-[11px] font-medium tracking-tight">Tool</span>
      </button>

      {/* 3. Tab: Info */}
      <button
        onClick={() => onSelectTab('info')}
        className={`relative flex min-h-[48px] min-w-[72px] flex-col items-center justify-center transition ${
          activeTab === 'info'
            ? 'text-neutral-950 dark:text-white font-medium'
            : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
        }`}
      >
        <div className="flex h-8 w-12 items-center justify-center">
          <div
            className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
              activeTab === 'info'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : ''
            }`}
          >
            {/* Ikon lingkaran dengan huruf i */}
            <svg
              className="h-4.5 w-4.5 stroke-[2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        </div>
        <span className="mt-0.5 text-[11px] font-medium tracking-tight">Info</span>
      </button>
    </nav>
  );
};

