import React from 'react';
import { X, FileText, Download, Keyboard, ShieldCheck, Moon, Sun, Monitor, RefreshCw } from 'lucide-react';
import { ThemeMode } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenShortcuts: () => void;
  onOpenPrivacy: () => void;
  onInstallPwa: () => void;
  onResetLayout: () => void;
}

export const MobileMenuSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  themeMode,
  onThemeChange,
  onOpenShortcuts,
  onOpenPrivacy,
  onInstallPwa,
  onResetLayout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full flex-col rounded-t-2xl border-t border-neutral-300 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-wordmark text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
              tools
            </span>
            <span className="font-mono-tech text-xs text-neutral-500">workbench menu</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex flex-col divide-y divide-neutral-200 overflow-y-auto py-2 dark:divide-neutral-800">
          {/* Theme selector */}
          <div className="py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Appearance
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2">
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
                    onClick={() => onThemeChange(m.id as ThemeMode)}
                    className={`flex items-center justify-center gap-1.5 rounded border py-2 text-xs font-mono-tech transition ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-1 py-3 text-sm">
            <button
              onClick={() => {
                onInstallPwa();
                onClose();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Download className="h-4 w-4 text-neutral-500" />
              <span>Install as App (PWA)</span>
            </button>
            <button
              onClick={() => {
                onOpenShortcuts();
                onClose();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Keyboard className="h-4 w-4 text-neutral-500" />
              <span>Keyboard Shortcuts Overlay</span>
            </button>
            <button
              onClick={() => {
                onOpenPrivacy();
                onClose();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Privacy & Architecture Guarantees</span>
            </button>
            <button
              onClick={() => {
                onResetLayout();
                onClose();
              }}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <RefreshCw className="h-4 w-4 text-neutral-500" />
              <span>Reset Desk Layout</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 pt-3 text-center text-xs text-neutral-400 font-mono-tech dark:border-neutral-800">
          Runs locally · No upload · 106 tools
        </div>
      </div>
    </div>
  );
};
