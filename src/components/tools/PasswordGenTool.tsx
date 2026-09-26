import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Download, ShieldCheck, KeyRound } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const PasswordGenTool: React.FC<Props> = ({ onFileOut }) => {
  const [length, setLength] = useState<number>(24);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const generate = () => {
    let chars = '';
    const upper = excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    const numbers = excludeAmbiguous ? '23456789' : '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (!chars) chars = lower;

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }

    setPassword(result);
    setHistory((prev) => [result, ...prev.slice(0, 7)]);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  // Entropy calculation
  let poolSize = 0;
  if (useUpper) poolSize += 26;
  if (useLower) poolSize += 26;
  if (useNumbers) poolSize += 10;
  if (useSymbols) poolSize += 28;
  const entropy = Math.round(length * (poolSize > 0 ? Math.log2(poolSize) : 0));

  const getStrengthLabel = (ent: number) => {
    if (ent < 45) return { text: 'Weak', color: 'text-rose-500', bar: 'bg-rose-500 w-1/4' };
    if (ent < 70) return { text: 'Fair', color: 'text-amber-500', bar: 'bg-amber-500 w-2/4' };
    if (ent < 95) return { text: 'Strong', color: 'text-emerald-500', bar: 'bg-emerald-500 w-3/4' };
    return { text: 'Very Strong (Military grade)', color: 'text-emerald-600', bar: 'bg-emerald-600 w-full' };
  };

  const strength = getStrengthLabel(entropy);

  const handleCopy = (str = password) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleExportHistory = () => {
    const content = history.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Active Password Box */}
      <div className="rounded border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Generated Password
          </span>
          <span className="text-xs font-mono-tech text-neutral-400">
            CSPRNG: window.crypto
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 overflow-x-auto rounded border border-neutral-200 bg-neutral-50 p-3.5 font-mono-tech text-base tracking-wider text-neutral-900 dark:border-neutral-750 dark:bg-neutral-950 dark:text-neutral-100 select-all">
            {password}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy()}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3.5 py-3 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-750"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={generate}
              className="flex items-center gap-1.5 rounded border border-neutral-900 bg-neutral-900 px-3.5 py-3 text-xs font-medium text-white transition hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* Strength meter */}
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500">
              Entropy: <strong className="font-mono-tech text-neutral-800 dark:text-neutral-200">{entropy} bits</strong>
            </span>
            <span className={`font-medium ${strength.color}`}>
              {strength.text}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div className={`h-full transition-all duration-300 ${strength.bar}`} />
          </div>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Length: {length} characters
            </span>
            <span className="font-mono-tech text-neutral-400">8 - 128</span>
          </div>
          <input
            type="range"
            min="8"
            max="128"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="mt-3 w-full accent-neutral-800 dark:accent-neutral-200"
          />

          <div className="mt-4 flex flex-col gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useUpper}
                onChange={(e) => setUseUpper(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useLower}
                onChange={(e) => setUseLower(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Special Symbols (!@#$%^&*)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-neutral-100"
              />
              <span>Exclude ambiguous characters (I, l, 1, 0, O)</span>
            </label>
          </div>
        </div>

        {/* History / Batch */}
        <div className="flex flex-col justify-between rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Recent Seeds (Session Memory)
              </span>
              <span className="text-[11px] text-neutral-400 font-mono-tech">{history.length} items</span>
            </div>
            <div className="mt-3 flex flex-col gap-1.5 font-mono-tech text-xs">
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleCopy(h)}
                  className="flex cursor-pointer items-center justify-between rounded border border-transparent px-2 py-1 transition hover:border-neutral-300 hover:bg-neutral-100 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  <span className="truncate pr-2">{h}</span>
                  <Copy className="h-3 w-3 shrink-0 text-neutral-400" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportHistory}
            className="mt-3 flex items-center justify-center gap-1.5 rounded border border-neutral-300 bg-neutral-50 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
          >
            <Download className="h-3.5 w-3.5" />
            Export Seeds as Text File
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Hardware entropy pool: window.crypto.getRandomValues · Never logged or transmitted</span>
      </div>
    </div>
  );
};
