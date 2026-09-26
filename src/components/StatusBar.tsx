import React from 'react';
import { ShieldCheck, HardDriveDownload, RotateCcw } from 'lucide-react';

interface Props {
  filesOutBytes: number;
  onOpenPrivacy: () => void;
  onRestoreLayout: () => void;
}

export const StatusBar: React.FC<Props> = ({
  filesOutBytes,
  onOpenPrivacy,
  onRestoreLayout,
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <footer className="flex h-7 select-none items-center justify-between border-t border-neutral-300 bg-neutral-100/90 px-3 text-[11px] font-mono-tech text-neutral-500 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400">
      {/* Left side statement */}
      <div className="flex items-center gap-2 truncate">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span className="truncate">
          Runs locally · No upload · Files stay on this device
        </span>
      </div>

      {/* Right side counters & actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span>Out: <strong className="text-neutral-800 dark:text-neutral-200">{formatBytes(filesOutBytes)}</strong></span>
          <span className="hidden sm:inline">Ready —</span>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-neutral-900 hover:underline dark:hover:text-white"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            onClick={onOpenPrivacy}
            className="hover:text-neutral-900 hover:underline dark:hover:text-white"
          >
            Terms
          </button>
        </div>

        <button
          onClick={onRestoreLayout}
          title="Restore layout (⌘\)"
          className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden md:inline">Restore layout ⌘\</span>
        </button>
      </div>
    </footer>
  );
};
