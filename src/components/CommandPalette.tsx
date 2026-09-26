import React, { useState, useEffect, useRef } from 'react';
import { ALL_TOOLS } from '../data/toolsData';
import { ToolItem } from '../types';
import { Search, Star, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (id: string) => void;
}

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  const filtered = query.trim()
    ? ALL_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.set.toLowerCase().includes(query.toLowerCase()) ||
          t.path.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_TOOLS.filter((t) => t.starred).slice(0, 15);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectTool(filtered[selectedIndex].id);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 backdrop-blur-xs sm:pt-24">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Search className="h-5 w-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tool name or category... (e.g. PDF, Image, Hash)"
            className="ml-3 w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none dark:text-neutral-100"
          />
          <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono-tech text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            Esc
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400 font-mono-tech">
              No matching tools found.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {!query.trim() && (
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Popular Tools
                </div>
              )}
              {filtered.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 text-xs transition ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                        : 'text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {tool.starred ? (
                        <Star
                          className={`h-3.5 w-3.5 shrink-0 ${
                            isSelected
                              ? 'fill-amber-300 text-amber-300'
                              : 'fill-amber-400 text-amber-400'
                          }`}
                        />
                      ) : (
                        <span className="w-3.5" />
                      )}
                      <div className="flex flex-col truncate">
                        <span className="font-medium truncate">{tool.name}</span>
                        <span
                          className={`truncate text-[11px] ${
                            isSelected
                              ? 'text-neutral-300 dark:text-neutral-600'
                              : 'text-neutral-400'
                          }`}
                        >
                          {tool.path}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono-tech text-[10px] ${
                          isSelected
                            ? 'bg-neutral-800 text-neutral-300 dark:bg-neutral-200 dark:text-neutral-700'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {tool.set}
                      </span>
                      {isSelected && <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] font-mono-tech text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950">
          <span>Navigate with ↑ ↓ · Press Enter to open</span>
          <span>106 Tools Total</span>
        </div>
      </div>
    </div>
  );
};
