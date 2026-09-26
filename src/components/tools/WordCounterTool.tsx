import React, { useState } from 'react';
import { Type, Download, Copy, Check, Trash2 } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const WordCounterTool: React.FC<Props> = ({ onFileOut }) => {
  const [text, setText] = useState<string>(
    `BrowserBasedTools Desk is a privacy-first, client-side workbench.\nAll computations run locally on your device without transmitting raw payload data to external servers.\nEvery tool works this way. No accounts, no telemetry, no tracking.`
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Metrics
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const wordsArray = text.trim() ? text.trim().split(/\s+/) : [];
  const wordsCount = text.trim() ? wordsArray.length : 0;
  const sentencesCount = text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphsCount = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
  const readingTimeMin = Math.ceil(wordsCount / 225);
  const speakingTimeMin = Math.ceil(wordsCount / 130);

  // Top keywords
  const frequencyMap: Record<string, number> = {};
  wordsArray.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 2) {
      frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top metrics bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Words', value: wordsCount },
          { label: 'Characters', value: charsWithSpaces },
          { label: 'No Spaces', value: charsNoSpaces },
          { label: 'Sentences', value: sentencesCount },
          { label: 'Paragraphs', value: paragraphsCount },
          { label: 'Reading Time', value: `~${readingTimeMin} min` },
        ].map((m, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {m.label}
            </span>
            <span className="mt-1 font-mono-tech text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Editor Canvas */}
      <div className="relative rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full resize-y bg-transparent p-4 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100"
          placeholder="Paste or type text to inspect character count..."
        />
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
          <span>Speaking Time: ~{speakingTimeMin} min (130 wpm)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded bg-neutral-900 px-2.5 py-1 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-3 w-3" />
              Save File
            </button>
          </div>
        </div>
      </div>

      {/* Keyword Density */}
      {sortedKeywords.length > 0 && (
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Frequent Keywords
          </span>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {sortedKeywords.map(([kw, count]) => (
              <span
                key={kw}
                className="flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono-tech text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
              >
                <span>{kw}</span>
                <span className="rounded bg-neutral-200 px-1 py-0.2 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
