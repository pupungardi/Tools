import React, { useState } from 'react';
import { TOOL_SETS, ALL_TOOLS } from '../../data/toolsData';
import { Search, Star } from 'lucide-react';

interface Props {
  activeToolId: string | null;
  onSelectTool: (id: string) => void;
  onOpenSearchModal?: () => void;
}

// 11 categories in exact order specified in Bab 6.D & screenshot
const MOBILE_CATEGORIES = [
  { id: 'pdf', name: 'PDF', count: 17 },
  { id: 'audio', name: 'Audio', count: 13 },
  { id: 'video', name: 'Video', count: 6 },
  { id: 'image', name: 'Image', count: 5 },
  { id: 'developer', name: 'Developer', count: 6 },
  { id: 'security', name: 'Security', count: 26 },
  { id: 'time', name: 'Time', count: 2 },
  { id: 'utilities', name: 'Utilities', count: 4 },
  { id: 'calculate', name: 'Calculate', count: 3 },
  { id: 'color', name: 'Color', count: 11 },
  { id: 'network', name: 'Network', count: 3 },
];

export const MobileBrowserView: React.FC<Props> = ({
  activeToolId,
  onSelectTool,
}) => {
  const [filterText, setFilterText] = useState<string>('');
  const [expandedSets, setExpandedSets] = useState<Record<string, boolean>>({});

  const toggleSet = (setId: string) => {
    setExpandedSets((prev) => ({
      ...prev,
      [setId]: !prev[setId],
    }));
  };

  const renderCategoryIcon = (id: string) => {
    const cls = 'h-[18px] w-[18px] text-neutral-900 dark:text-neutral-100 shrink-0';
    switch (id) {
      case 'pdf':
        // Dokumen / lembar: folded corner top-right with lines
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="13" y2="17" />
          </svg>
        );
      case 'audio':
        // Gelombang suara: 5 vertical lines with round caps
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="4" y1="10" x2="4" y2="14" />
            <line x1="8" y1="6" x2="8" y2="18" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="16" y1="6" x2="16" y2="18" />
            <line x1="20" y1="10" x2="20" y2="14" />
          </svg>
        );
      case 'video':
        // Kamera video
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="13" height="12" rx="2" />
            <path d="m15 10 6-4v12l-6-4" />
          </svg>
        );
      case 'image':
        // Gambar / foto: square with rounded corners, mountains and sun
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        );
      case 'developer':
        // Tanda < >
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7 8 3 12 7 16" />
            <polyline points="17 8 21 12 17 16" />
          </svg>
        );
      case 'security':
        // Perisai dengan garis vertikal di tengah
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        );
      case 'time':
        // Jam dengan jarum
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
        );
      case 'utilities':
        // Hexagonal nut with round hole in center
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2.5 20.2 7.2 20.2 16.8 12 21.5 3.8 16.8 3.8 7.2" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        );
      case 'calculate':
        // Kalkulator dengan layar dan 6 tombol
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="7.5" y1="6" x2="16.5" y2="6" />
            <circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12" cy="11" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="16" cy="11" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'color':
        // Lingkaran separuh: kiri hitam pekat, kanan hollow
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 0 0 18V3z" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'network':
        // Sinyal wifi: 3 arc radiating up
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5a10 10 0 0 1 14 0" />
            <path d="M8.5 16a5 5 0 0 1 7 0" />
            <circle cx="12" cy="19.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        );
      default:
        return (
          <svg
            className={cls}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
    }
  };

  const filteredCategories = filterText.trim()
    ? MOBILE_CATEGORIES.map((cat) => {
        const matchingTools = ALL_TOOLS.filter(
          (t) =>
            t.set === cat.id &&
            (t.name.toLowerCase().includes(filterText.toLowerCase()) ||
              t.description.toLowerCase().includes(filterText.toLowerCase()))
        );
        return { cat, tools: matchingTools };
      }).filter((item) => item.tools.length > 0)
    : null;

  return (
    <div className="flex flex-col w-full pb-24 bg-white dark:bg-neutral-950 font-sans">
      {/* Section Header "BROWSER" (Matching video frame 00:00) */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 text-xs bg-white dark:bg-neutral-950">
        <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
          BROWSER
        </span>
        <span className="font-mono text-[13px] text-neutral-400 dark:text-neutral-500">
          106
        </span>
      </div>

      {/* Search / Filter bar (Bab 6.C, Screenshot) */}
      <div className="flex h-10 items-center border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-950">
        <Search className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500 stroke-[1.8]" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter tools"
          className="ml-3 w-full bg-transparent text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none dark:text-neutral-100"
        />
        {filterText && (
          <button
            onClick={() => setFilterText('')}
            className="p-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            ✕
          </button>
        )}
      </div>

      {/* List Kategori Tool (Bab 6.D, Screenshot) - Seamless, NO DIVIDERS between items */}
      <div className="flex flex-col bg-white dark:bg-neutral-950 pt-1">
        {filteredCategories
          ? filteredCategories.map(({ cat, tools }) => (
              <div key={cat.id} className="flex flex-col">
                <div className="flex h-11 items-center justify-between px-4 bg-neutral-50 dark:bg-neutral-900/40">
                  <div className="flex items-center gap-3.5">
                    {renderCategoryIcon(cat.id)}
                    <span className="text-[16px] font-semibold text-neutral-900 dark:text-neutral-100">
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-mono text-[14px] text-neutral-400">
                    {tools.length}
                  </span>
                </div>
                <div className="flex flex-col pl-11 pr-4 bg-white dark:bg-neutral-950">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onSelectTool(t.id)}
                      className="flex min-h-[46px] items-center justify-between py-2 text-left"
                    >
                      <span className="text-[14px] text-neutral-800 dark:text-neutral-200">
                        {t.name}
                      </span>
                      {t.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            ))
          : MOBILE_CATEGORIES.map((cat) => {
              const isExpanded = !!expandedSets[cat.id];
              const setTools = ALL_TOOLS.filter((t) => t.set === cat.id);

              return (
                <div key={cat.id} className="flex flex-col">
                  {/* Category Row: Triangle -> Icon -> Category Name (bold) -> 2-digit count */}
                  <div
                    onClick={() => toggleSet(cat.id)}
                    className="flex min-h-[44px] cursor-pointer items-center justify-between px-4 py-2.5 transition active:bg-neutral-100 dark:active:bg-neutral-900"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* 1. Small solid disclosure triangle ▸ */}
                      <span className="flex h-4 w-4 items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <svg
                          className={`h-2 w-2 transition-transform duration-150 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                          viewBox="0 0 10 10"
                          fill="currentColor"
                        >
                          <path d="M2.5 1.5L8 5L2.5 8.5V1.5Z" />
                        </svg>
                      </span>

                      {/* 2. Category icon */}
                      <div className="flex h-5 w-5 items-center justify-center">
                        {renderCategoryIcon(cat.id)}
                      </div>

                      {/* 3. Category Name in semi-bold */}
                      <span className="text-[16px] font-semibold text-neutral-900 dark:text-neutral-100">
                        {cat.name}
                      </span>
                    </div>

                    {/* 4. 2-digit count in monospace */}
                    <span className="font-mono text-[14px] text-neutral-500 dark:text-neutral-400">
                      {String(cat.count).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Expanded Sub-Tools */}
                  {isExpanded && (
                    <div className="flex flex-col border-y border-neutral-100 bg-neutral-50/60 pl-11 pr-4 dark:border-neutral-900 dark:bg-neutral-900/30">
                      {setTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => onSelectTool(tool.id)}
                          className={`flex min-h-[44px] items-center justify-between py-2 text-left text-[14px] transition ${
                            activeToolId === tool.id
                              ? 'font-semibold text-neutral-950 dark:text-white'
                              : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-2">{tool.name}</span>
                          {tool.starred && (
                            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};
