import React, { useState } from 'react';
import { Maximize2, Copy, Check } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const AspectRatioTool: React.FC<Props> = ({ onFileOut }) => {
  const [origW, setOrigW] = useState<number>(1920);
  const [origH, setOrigH] = useState<number>(1080);
  const [targetW, setTargetW] = useState<number>(1280);
  const [copied, setCopied] = useState<boolean>(false);

  // GCD
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = origW > 0 && origH > 0 ? gcd(origW, origH) : 1;
  const ratioW = origW / divisor;
  const ratioH = origH / divisor;

  const targetH = origW > 0 ? Math.round((targetW * origH) / origW) : 0;

  const presets = [
    { label: '16:9 Widescreen', w: 16, h: 9 },
    { label: '4:3 Standard', w: 4, h: 3 },
    { label: '1:1 Square', w: 1, h: 1 },
    { label: '21:9 Ultrawide', w: 21, h: 9 },
    { label: '9:16 Vertical / Reels', w: 9, h: 16 },
    { label: '3:2 Classic 35mm', w: 3, h: 2 },
  ];

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(`aspect-ratio: ${ratioW} / ${ratioH};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Ratio Display */}
      <div className="flex flex-wrap items-center justify-between rounded border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Calculated Ratio
          </span>
          <div className="mt-1 font-mono-tech text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {ratioW} : {ratioH}
          </div>
          <span className="text-xs font-mono-tech text-neutral-400">
            Decimal: {(origW / (origH || 1)).toFixed(4)}
          </span>
        </div>

        <button
          onClick={handleCopyCSS}
          className="flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied CSS!' : 'Copy CSS aspect-ratio'}
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Source Inputs */}
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Original Resolution
          </span>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-tech text-neutral-500">Width (px)</label>
              <input
                type="number"
                value={origW}
                onChange={(e) => setOrigW(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono-tech text-neutral-500">Height (px)</label>
              <input
                type="number"
                value={origH}
                onChange={(e) => setOrigH(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setOrigW(p.w * 100);
                  setOrigH(p.h * 100);
                }}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] font-mono-tech text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Proportional Scaler */}
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Proportional Target Scale
          </span>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-tech text-neutral-500">Target Width</label>
              <input
                type="number"
                value={targetW}
                onChange={(e) => setTargetW(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-1 w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono-tech text-neutral-500">Calculated Height</label>
              <div className="mt-1 flex h-[34px] items-center rounded border border-neutral-200 bg-neutral-100 px-3 font-mono-tech text-xs font-bold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {targetH} px
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 font-mono-tech">
            <span>Result: {targetW} × {targetH} px</span>
            <span>Total Pixels: {((targetW * targetH) / 1000000).toFixed(2)} MP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
