import React, { useState, useRef, useEffect } from 'react';
import { TOOL_SETS, ALL_TOOLS } from '../data/toolsData';
import { ToolItem, ToolSet } from '../types';
import { Search, ChevronRight, ChevronDown, Star, Sparkles, Folder, FolderOpen } from 'lucide-react';

interface Props {
  activeToolId: string | null;
  onSelectTool: (id: string) => void;
  onOpenCommandPalette: () => void;
  width: number;
  onWidthChange: (w: number) => void;
  onResetWidth: () => void;
}

export const BrowserPanel: React.FC<Props> = ({
  activeToolId,
  onSelectTool,
  onOpenCommandPalette,
  width,
  onWidthChange,
  onResetWidth,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [expandedSets, setExpandedSets] = useState<Record<string, boolean>>({
    pdf: true,
    audio: false,
    developer: true,
    security: false,
    image: true,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isResizingRef = useRef<boolean>(false);

  const toggleSet = (setId: string) => {
    setExpandedSets((prev) => ({
      ...prev,
      [setId]: !prev[setId],
    }));
  };

  // Keyboard shortcut '/' focuses the filter search box
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Grip resizing handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = Math.min(Math.max(220, ev.clientX), 500);
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Filter tools if user types in search box
  const isSearching = filterQuery.trim().length > 0;
  const filteredTools = isSearching
    ? ALL_TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(filterQuery.toLowerCase()) ||
          t.path.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : [];

  return (
    <aside
      style={{ width: `${width}px` }}
      className="relative flex h-full shrink-0 flex-col border-r border-neutral-300 bg-neutral-100/60 dark:border-neutral-800 dark:bg-neutral-900/60"
    >
      {/* Panel Header */}
      <div className="flex h-10 select-none items-center justify-between border-b border-neutral-300 px-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">
            Browser
          </span>
          <span className="font-mono-tech text-[10px] text-neutral-400">106</span>
        </div>

        {/* Command palette button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1 rounded border border-neutral-300 bg-white px-2 py-0.5 text-[10px] font-mono-tech text-neutral-600 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          title="Command Palette (⌘K)"
        >
          <Search className="h-3 w-3" />
          <span>⌘K</span>
        </button>
      </div>

      {/* Filter search bar */}
      <div className="border-b border-neutral-300 p-2 dark:border-neutral-800">
        <div className="flex items-center gap-2 rounded border border-neutral-300 bg-white px-2.5 py-1.5 dark:border-neutral-750 dark:bg-neutral-950">
          <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter tools... (/)"
            className="w-full bg-transparent font-mono-tech text-xs text-neutral-900 focus:outline-none dark:text-neutral-100"
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Directory Folder Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {isSearching ? (
          <div className="flex flex-col gap-1">
            <div className="px-2 py-1 text-[11px] font-mono-tech text-neutral-500">
              Found {filteredTools.length} tools matching &quot;{filterQuery}&quot;:
            </div>
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition ${
                  activeToolId === tool.id
                    ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                    : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {tool.starred && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
                  <span className="truncate">{tool.name}</span>
                </div>
                <span className="font-mono-tech text-[10px] text-neutral-400">{tool.set}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {TOOL_SETS.map((set) => {
              const isExpanded = !!expandedSets[set.id];
              const setTools = ALL_TOOLS.filter((t) => t.set === set.id);

              return (
                <div key={set.id} className="flex flex-col">
                  {/* Category folder header */}
                  <button
                    onClick={() => toggleSet(set.id)}
                    className="group flex w-full items-start justify-between rounded px-2 py-1.5 text-left transition hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono-tech text-[11px] text-neutral-400">{set.index}</span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {set.name}
                          </span>
                        </div>
                        <p className="line-clamp-1 pr-2 text-[10px] text-neutral-500 font-normal">
                          {set.tagline}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono-tech text-[11px] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                      {String(set.count).padStart(2, '0')}
                    </span>
                  </button>

                  {/* Expanded tools list */}
                  {isExpanded && (
                    <div className="ml-5 flex flex-col border-l border-neutral-300 pl-2 pt-0.5 dark:border-neutral-800">
                      {setTools.map((tool) => {
                        const isSelected = activeToolId === tool.id;

                        return (
                          <button
                            key={tool.id}
                            onClick={() => onSelectTool(tool.id)}
                            className={`group flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs transition ${
                              isSelected
                                ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-medium'
                                : 'text-neutral-700 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800'
                            }`}
                          >
                            <span className="truncate pr-1">{tool.name}</span>
                            {tool.starred && (
                              <Star
                                className={`h-3 w-3 shrink-0 ${
                                  isSelected
                                    ? 'fill-amber-300 text-amber-300'
                                    : 'fill-amber-400/80 text-amber-400'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resize Grip Handle */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={onResetWidth}
        title="Drag to resize, double-click to reset"
        className="absolute -right-1 top-0 bottom-0 z-20 w-2.5 cursor-col-resize hover:bg-neutral-400/30 active:bg-neutral-500/50"
      />
    </aside>
  );
};
