import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Copy, Palette } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const ColorContrastTool: React.FC<Props> = ({ onFileOut }) => {
  const [fg, setFg] = useState<string>('#0f172a');
  const [bg, setBg] = useState<string>('#ffffff');
  const [copied, setCopied] = useState<boolean>(false);

  // Luminance calculation
  const getLuminance = (hex: string): number => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num)) return 0;

    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const sRGB = [r, g, b].map((c) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (brighter + 0.05) / (darker + 0.05);
  const formattedRatio = ratio.toFixed(2);

  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  const handleSwap = () => {
    setFg(bg);
    setBg(fg);
  };

  const handleCopyCSS = () => {
    const css = `color: ${fg};\nbackground-color: ${bg};\n/* Contrast Ratio: ${formattedRatio}:1 */`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pickers & Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Foreground Input */}
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Foreground Color (Text)
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-9 w-10 cursor-pointer rounded border border-neutral-300 bg-transparent p-0.5"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 font-mono-tech text-xs uppercase text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Background Input */}
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Background Color
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-9 w-10 cursor-pointer rounded border border-neutral-300 bg-transparent p-0.5"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 font-mono-tech text-xs uppercase text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Swap & Ratio Score */}
        <div className="flex flex-col justify-between rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Contrast Ratio
            </span>
            <button
              onClick={handleSwap}
              title="Swap Foreground & Background"
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Swap
            </button>
          </div>
          <div className="mt-1 font-mono-tech text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {formattedRatio} <span className="text-sm font-normal text-neutral-400">: 1</span>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div
        style={{ backgroundColor: bg, color: fg }}
        className="rounded border border-neutral-300 p-8 shadow-sm transition-colors dark:border-neutral-700"
      >
        <div className="text-2xl font-bold">The quick brown fox jumps over the lazy dog</div>
        <p className="mt-2 text-sm leading-relaxed">
          Good typography provides effortless readability. High contrast between text and its background
          ensures readability for users with low vision or when viewing displays in bright daylight.
        </p>
        <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs font-mono-tech opacity-70">
          <span>Text: {fg}</span>
          <span>Background: {bg}</span>
        </div>
      </div>

      {/* WCAG Compliance Matrix */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'AA Normal Text', min: '4.5:1', pass: aaNormal },
          { label: 'AA Large Text', min: '3.0:1', pass: aaLarge },
          { label: 'AAA Normal Text', min: '7.0:1', pass: aaaNormal },
          { label: 'AAA Large Text', min: '4.5:1', pass: aaaLarge },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between rounded border p-3 ${
              item.pass
                ? 'border-emerald-300 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'border-rose-200 bg-rose-50/50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-400'
            }`}
          >
            <div>
              <div className="text-xs font-semibold">{item.label}</div>
              <div className="font-mono-tech text-[11px] opacity-75">Req: {item.min}</div>
            </div>
            {item.pass ? (
              <span className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                <Check className="h-3 w-3" /> PASS
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                <X className="h-3 w-3" /> FAIL
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Palette className="h-3.5 w-3.5" />
          <span>Compliant with W3C Web Content Accessibility Guidelines (WCAG) 2.1</span>
        </div>
        <button
          onClick={handleCopyCSS}
          className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-750"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied CSS!' : 'Copy CSS Snippet'}
        </button>
      </div>
    </div>
  );
};
