import React, { useState } from 'react';
import { GitCompare, Copy, Check, Download } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const TextDiffTool: React.FC<Props> = ({ onFileOut }) => {
  const [textA, setTextA] = useState<string>(
    `// Initial version\nfunction processData(payload) {\n  console.log("Processing payload");\n  return payload.trim();\n}`
  );
  const [textB, setTextB] = useState<string>(
    `// Optimized version\nfunction processData(payload, options = {}) {\n  // Client-side sanitization\n  if (!payload) return "";\n  console.log("Processing payload securely");\n  return payload.trim();\n}`
  );

  const linesA = textA.split('\n');
  const linesB = textB.split('\n');

  // Simple line diff algorithm
  const diffRows: { type: 'added' | 'removed' | 'same'; text: string }[] = [];
  const maxLines = Math.max(linesA.length, linesB.length);

  for (let i = 0; i < maxLines; i++) {
    const a = linesA[i];
    const b = linesB[i];

    if (a === b) {
      if (a !== undefined) diffRows.push({ type: 'same', text: a });
    } else {
      if (a !== undefined) diffRows.push({ type: 'removed', text: a });
      if (b !== undefined) diffRows.push({ type: 'added', text: b });
    }
  }

  const additions = diffRows.filter((r) => r.type === 'added').length;
  const deletions = diffRows.filter((r) => r.type === 'removed').length;

  return (
    <div className="flex flex-col gap-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            Original Text (A)
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={7}
            className="w-full resize-y bg-transparent p-3 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100"
          />
        </div>

        <div className="flex flex-col rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            Modified Text (B)
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={7}
            className="w-full resize-y bg-transparent p-3 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100"
          />
        </div>
      </div>

      {/* Diff Output */}
      <div className="rounded border border-neutral-300 bg-neutral-950 p-4 font-mono-tech text-xs text-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[11px] text-neutral-400">
          <span>Unified Diff Preview</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">+{additions} additions</span>
            <span className="text-rose-400">-{deletions} deletions</span>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-0.5 overflow-x-auto">
          {diffRows.map((r, i) => (
            <div
              key={i}
              className={`flex items-start px-2 py-0.5 ${
                r.type === 'added'
                  ? 'bg-emerald-950/70 text-emerald-300'
                  : r.type === 'removed'
                  ? 'bg-rose-950/70 text-rose-300'
                  : 'text-neutral-400'
              }`}
            >
              <span className="w-5 select-none font-bold">
                {r.type === 'added' ? '+' : r.type === 'removed' ? '-' : ' '}
              </span>
              <span className="whitespace-pre">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
