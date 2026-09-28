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
            ? 'text-neutral-950 font-medium dark:text-white'
            : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
        }`}
      >
        <div className="relative flex h-8 w-14 items-center justify-center">
          {/* Badge 106: Always present over Browse tab as shown in 1. Tool.png */}
          <span className="absolute -top-1.5 z-20 flex h-4.5 items-center justify-center rounded-full bg-neutral-950 px-2 font-mono text-[10px] font-bold leading-none tracking-tight text-white shadow-sm dark:bg-white dark:text-neutral-950">
            106
          </span>
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
              activeTab === 'browse'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {/* List icon matching 1. Tool.png */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
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
            ? 'text-neutral-950 font-medium dark:text-white'
            : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
        }`}
      >
        <div className="flex h-8 w-14 items-center justify-center">
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
              activeTab === 'tool'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {/* Exact Icon from 1. Tool.png: window/desk rectangle with header line divider */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="3.5" />
              <line x1="3" y1="9" x2="21" y2="9" />
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
            ? 'text-neutral-950 font-medium dark:text-white'
            : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
        }`}
      >
        <div className="flex h-8 w-14 items-center justify-center">
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition ${
              activeTab === 'info'
                ? 'bg-neutral-200 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {/* Circle with info i */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </div>
        <span className="mt-0.5 text-[11px] font-medium tracking-tight">Info</span>
      </button>
    </nav>
  );
};

