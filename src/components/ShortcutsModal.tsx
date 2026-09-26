import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { action: 'Buka command palette (cari tool)', keys: '⌘K' },
    { action: 'Filter daftar tool di Browser', keys: '/' },
    { action: 'Navigasi mundur / maju', keys: '⌘[ / ⌘]' },
    { action: 'Jelajah folder tool tree', keys: 'Tab, lalu ↑ ↓ → ←' },
    { action: 'Toggle panel Browser (kiri)', keys: '⌘1' },
    { action: 'Toggle panel Inspector (kanan)', keys: '⌘2' },
    { action: 'Mode layar penuh untuk tool aktif', keys: 'F / ⌘\\' },
    { action: 'Resize lebar panel samping', keys: 'Grip drag / double-click' },
    { action: 'Salin path tool aktif', keys: '⌘⇧C' },
    { action: 'Toggle light / dark / system', keys: '⌘⇧L' },
    { action: 'Buka lembar shortcut ini', keys: '⌘/' },
    { action: 'Tutup modal / palette', keys: 'Esc' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Keyboard Shortcuts & Desk Interactions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shortcuts Table */}
        <div className="max-h-96 overflow-y-auto p-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 pb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:border-neutral-800">
                <th className="pb-2 font-medium">Aksi</th>
                <th className="pb-2 text-right font-medium">Shortcut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
              {shortcuts.map((s, i) => (
                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50">
                  <td className="py-2.5 text-neutral-700 dark:text-neutral-300">{s.action}</td>
                  <td className="py-2.5 text-right">
                    <kbd className="rounded border border-neutral-300 bg-neutral-100 px-2 py-1 font-mono-tech text-[11px] font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                      {s.keys}
                    </kbd>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2.5 text-right font-mono-tech text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
          Press <kbd className="rounded border border-neutral-300 px-1 dark:border-neutral-700">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};
