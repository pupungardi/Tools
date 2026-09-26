import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, Play, Pause, RefreshCw } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const TimestampTool: React.FC<Props> = ({ onFileOut }) => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isLive, setIsLive] = useState<boolean>(true);
  const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const numEpoch = parseInt(inputEpoch) || 0;
  // If user entered 13-digit epoch (ms), handle gracefully
  const dateObj = new Date(numEpoch > 9999999999 ? numEpoch : numEpoch * 1000);
  const isValidDate = !isNaN(dateObj.getTime());

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleDateToEpoch = (dStr: string) => {
    setDateInput(dStr);
    const d = new Date(dStr);
    if (!isNaN(d.getTime())) {
      setInputEpoch(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const getRelativeTime = (d: Date) => {
    const diff = Math.floor((d.getTime() - Date.now()) / 1000);
    const abs = Math.abs(diff);
    let str = '';
    if (abs < 60) str = `${abs} seconds`;
    else if (abs < 3600) str = `${Math.floor(abs / 60)} minutes`;
    else if (abs < 86400) str = `${Math.floor(abs / 3600)} hours`;
    else str = `${Math.floor(abs / 86400)} days`;

    return diff >= 0 ? `in ${str}` : `${str} ago`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Current Live Epoch Box */}
      <div className="flex flex-wrap items-center justify-between rounded border border-neutral-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Current Unix Epoch Timestamp
          </div>
          <div className="mt-1 font-mono-tech text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {currentEpoch}
          </div>
          <div className="mt-1 text-xs text-neutral-500 font-mono-tech">
            {new Date(currentEpoch * 1000).toUTCString()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isLive ? 'Pause' : 'Resume'}
          </button>
          <button
            onClick={() => handleCopy(currentEpoch.toString(), 'live')}
            className="flex items-center gap-1.5 rounded border border-neutral-900 bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {copiedKey === 'live' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Timestamp
          </button>
        </div>
      </div>

      {/* Epoch Converter Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Epoch to Date */}
        <div className="flex flex-col gap-3 rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Epoch to Human Date
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(e.target.value)}
              className="w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="e.g. 1774579200"
            />
            <button
              onClick={() => setInputEpoch(Math.floor(Date.now() / 1000).toString())}
              className="rounded border border-neutral-300 px-2.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Now
            </button>
          </div>

          {/* Quick offsets */}
          <div className="flex flex-wrap gap-1 text-[11px] font-mono-tech">
            {[
              { label: '+1h', sec: 3600 },
              { label: '+1d', sec: 86400 },
              { label: '+7d', sec: 604800 },
              { label: '+30d', sec: 2592000 },
            ].map((off) => (
              <button
                key={off.label}
                onClick={() => setInputEpoch((prev) => ((parseInt(prev) || 0) + off.sec).toString())}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-neutral-600 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                {off.label}
              </button>
            ))}
          </div>

          {/* Formatted conversions */}
          {isValidDate ? (
            <div className="mt-2 flex flex-col gap-2 rounded bg-neutral-50 p-3 font-mono-tech text-xs text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 dark:border-neutral-800">
                <span className="text-neutral-400">Local:</span>
                <span className="truncate pl-2 font-semibold">{dateObj.toString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 dark:border-neutral-800">
                <span className="text-neutral-400">UTC:</span>
                <span className="truncate pl-2">{dateObj.toUTCString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 dark:border-neutral-800">
                <span className="text-neutral-400">ISO 8601:</span>
                <span className="truncate pl-2">{dateObj.toISOString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Relative:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{getRelativeTime(dateObj)}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-rose-500 font-mono-tech">Invalid Timestamp entered</div>
          )}
        </div>

        {/* Date to Epoch */}
        <div className="flex flex-col gap-3 rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Human Date to Epoch
          </span>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => handleDateToEpoch(e.target.value)}
            className="w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-2 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
          />

          <div className="mt-3 flex flex-col gap-2 rounded bg-neutral-50 p-3 font-mono-tech text-xs dark:bg-neutral-950">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Seconds:</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">
                {Math.floor(new Date(dateInput).getTime() / 1000) || '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Milliseconds:</span>
              <span className="text-neutral-700 dark:text-neutral-300">
                {new Date(dateInput).getTime() || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Clock className="h-3.5 w-3.5 text-neutral-400" />
        <span>Hardware POSIX clock sync · Client system time zone</span>
      </div>
    </div>
  );
};
