import React, { useState } from 'react';
import { Copy, Check, Minimize2, Maximize2, AlertCircle, FileText, Download } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const JsonFormatterTool: React.FC<Props> = ({ onFileOut }) => {
  const [input, setInput] = useState<string>(() => {
    return JSON.stringify(
      {
        app: "BrowserTools Desk",
        version: "2.4.0",
        privacy: {
          clientSideOnly: true,
          uploads: false,
          retention: "zero"
        },
        workbench: {
          engine: "V8 / SpiderMonkey",
          hardwareAcceleration: true,
          activeTools: 106
        }
      },
      null,
      2
    );
  });
  const [indent, setIndent] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{ keys: number; depth: number; bytes: number } | null>(null);

  const calculateStats = (obj: unknown, currentDepth = 1): { keys: number; depth: number } => {
    if (typeof obj !== 'object' || obj === null) {
      return { keys: 0, depth: currentDepth };
    }
    let totalKeys = 0;
    let maxChildDepth = currentDepth;

    for (const key of Object.keys(obj)) {
      totalKeys++;
      const val = (obj as Record<string, unknown>)[key];
      if (typeof val === 'object' && val !== null) {
        const childStats = calculateStats(val, currentDepth + 1);
        totalKeys += childStats.keys;
        if (childStats.depth > maxChildDepth) {
          maxChildDepth = childStats.depth;
        }
      }
    }
    return { keys: totalKeys, depth: maxChildDepth };
  };

  const handleFormat = (customIndent = indent) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, customIndent);
      setInput(formatted);
      setError(null);
      const st = calculateStats(parsed);
      setStats({ ...st, bytes: new Blob([formatted]).size });
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setError(null);
      const st = calculateStats(parsed);
      setStats({ ...st, bytes: new Blob([minified]).size });
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFormat(indent)}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Beautify
          </button>
          <button
            onClick={handleMinify}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Minify
          </button>
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-2 text-xs text-neutral-500 dark:border-neutral-800">
            <span>Spaces:</span>
            {[2, 4].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setIndent(s);
                  handleFormat(s);
                }}
                className={`rounded px-1.5 py-0.5 text-xs font-mono-tech ${
                  indent === s
                    ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Error alert if syntax invalid */}
      {error && (
        <div className="flex items-start gap-2 rounded border border-rose-300 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <span className="font-semibold">JSON Parse Error: </span>
            <span className="font-mono-tech">{error}</span>
          </div>
        </div>
      )}

      {/* Editor Canvas */}
      <div className="relative rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            try {
              const p = JSON.parse(e.target.value);
              setError(null);
              const st = calculateStats(p);
              setStats({ ...st, bytes: new Blob([e.target.value]).size });
            } catch (err) {
              setError((err as Error).message);
            }
          }}
          spellCheck={false}
          className="h-96 w-full resize-y bg-transparent p-3 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100"
          placeholder="Paste or write JSON here..."
        />
      </div>

      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-4 font-mono-tech">
          <span>Bytes: {stats?.bytes ?? new Blob([input]).size} B</span>
          <span>Keys: {stats?.keys ?? '—'}</span>
          <span>Depth: {stats?.depth ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <FileText className="h-3.5 w-3.5 text-neutral-400" />
          <span>RFC 8259 Standard · Evaluated locally</span>
        </div>
      </div>
    </div>
  );
};
