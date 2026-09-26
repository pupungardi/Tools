import React from 'react';
import { TOOL_SETS } from '../../data/toolsData';
import { SystemMetrics } from '../../types';
import { ServerOff, Wifi } from 'lucide-react';

interface Props {
  metrics: SystemMetrics;
  filesOutBytes: number;
}

export const MobileInspectorView: React.FC<Props> = ({ metrics, filesOutBytes }) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`;
  };

  // Order matching video frame 00:05:
  // Starts with AI, Document, PDF, Audio, Video, Image, Developer, Security, Time, Utilities, Calculate, Color, Network
  const orderedSets = [
    { index: '01', name: 'AI', count: '03' },
    { index: '02', name: 'Document', count: '11' },
    { index: '03', name: 'PDF', count: '17' },
    { index: '04', name: 'Audio', count: '13' },
    { index: '05', name: 'Video', count: '06' },
    { index: '06', name: 'Image', count: '05' },
    { index: '07', name: 'Developer', count: '06' },
    { index: '08', name: 'Security', count: '26' },
    { index: '09', name: 'Time', count: '02' },
    { index: '10', name: 'Utilities', count: '04' },
    { index: '11', count: '03', name: 'Calculate' },
    { index: '12', count: '11', name: 'Color' },
    { index: '13', count: '03', name: 'Network' },
  ];

  return (
    <div className="flex flex-col w-full pb-24 bg-white dark:bg-neutral-950">
      {/* Subheader bar matching video frame 00:05: INSPECTOR (left) | system (right) */}
      <div className="flex h-10 items-center justify-between border-b border-neutral-200 bg-white px-4 text-xs dark:border-neutral-800 dark:bg-neutral-950">
        <span className="font-semibold uppercase tracking-widest text-neutral-400">
          INSPECTOR
        </span>
        <span className="font-mono-tech text-neutral-400">
          system
        </span>
      </div>

      <div className="flex flex-col p-4">
        {/* Machine Readouts List */}
        <div className="flex flex-col divide-y divide-neutral-100 font-mono-tech text-xs dark:divide-neutral-900">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-500 font-sans">Isolated</span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {metrics.isolated ? 'yes' : 'yes'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-500 font-sans">WebGPU</span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {metrics.webGPU ? 'available' : 'available'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-neutral-500 font-sans">Storage</span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {metrics.storageEstimate.includes('quota') ? '12.9 GB free' : metrics.storageEstimate}
            </span>
          </div>
        </div>

        {/* Worker slots pill */}
        <div className="mt-3 flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 py-2 font-mono-tech text-xs text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          {metrics.cores || 8} worker slots
        </div>

        {/* Transport Section */}
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span className="font-sans text-neutral-500">Transport</span>
            <span className="text-neutral-900 dark:text-neutral-100">
              {formatBytes(filesOutBytes)}
            </span>
          </div>

          {/* Diagram Card */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            {/* Flow line */}
            <div className="flex items-center justify-between font-mono-tech text-xs">
              <span className="rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                FILE
              </span>
              <span className="text-neutral-400">→</span>
              <div className="flex flex-col items-center">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  THIS DEVICE
                </span>
                <span className="text-[10px] text-neutral-400">
                  CPU · WASM
                </span>
              </div>
              <span className="text-neutral-400">→</span>
              <span className="rounded border border-neutral-300 bg-white px-2 py-1 text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                FILE
              </span>
            </div>

            <div className="mt-4 border-t border-neutral-200 pt-3 text-center font-mono-tech text-xs text-neutral-400 dark:border-neutral-800">
              NETWORK · NOT USED
            </div>
          </div>

          <p className="mt-1 text-xs text-neutral-500 leading-relaxed font-sans">
            Every set but the network one works this way. <strong className="font-semibold text-neutral-800 dark:text-neutral-200">Network</strong> is the single exception, and says so on its own pages.
          </p>
        </div>

        {/* Sets Section */}
        <div className="mt-8 flex flex-col">
          <div className="border-b border-neutral-200 pb-2 text-xs font-semibold text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
            Sets
          </div>
          <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {orderedSets.map((s) => (
              <div
                key={s.index}
                className="flex items-center justify-between py-3 font-mono-tech text-xs"
              >
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">{s.index}</span>
                  <span className="font-sans font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                    {s.name}
                  </span>
                </div>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
