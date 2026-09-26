import React from 'react';
import { SystemMetrics, ToolItem } from '../types';
import { ShieldCheck, Cpu, Database, HardDrive, Wifi, Radio, ServerOff } from 'lucide-react';

interface Props {
  metrics: SystemMetrics;
  activeTool: ToolItem | null;
  isOpen: boolean;
  onToggle: () => void;
}

export const InspectorPanel: React.FC<Props> = ({
  metrics,
  activeTool,
  isOpen,
  onToggle,
}) => {
  if (!isOpen) return null;

  const isNetwork = activeTool?.isNetworkTool;

  return (
    <aside className="relative flex h-full w-72 shrink-0 flex-col border-l border-neutral-300 bg-neutral-100/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      {/* Panel Header */}
      <div className="flex select-none items-center justify-between border-b border-neutral-300 pb-3 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">
            Inspector
          </span>
          <span className="font-mono-tech text-[10px] text-neutral-400">engine</span>
        </div>

        <button
          onClick={onToggle}
          className="rounded px-1.5 py-0.5 text-[10px] font-mono-tech text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          title="Toggle Inspector (⌘2)"
        >
          ⌘2
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-3">
        <div className="flex flex-col gap-5">
          {/* Live Engine Technical Readouts */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Machine Architecture
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">Cores</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {metrics.cores} threads
                </div>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">Memory</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {metrics.memory}
                </div>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">Isolated</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {metrics.isolated ? 'Cross-Origin' : 'Standard'}
                </div>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">WebGPU</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {metrics.webGPU ? 'Enabled' : 'Available'}
                </div>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">Storage</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {metrics.storageEstimate}
                </div>
              </div>

              <div className="rounded border border-neutral-200 bg-white p-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="text-[10px] text-neutral-400">Transport</div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {isNetwork ? 'DoH HTTPS' : 'Loopback'}
                </div>
              </div>
            </div>
          </div>

          {/* Diagram flow: FILE -> THIS DEVICE (CPU / WASM) -> FILE */}
          <div className="rounded border border-neutral-300 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Data Pipeline Flow
            </span>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono-tech">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                FILE
              </span>
              <span className="text-neutral-400">→</span>
              <div className="flex flex-col items-center">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">THIS DEVICE</span>
                <span className="text-[9px] text-neutral-400">(CPU · WASM)</span>
              </div>
              <span className="text-neutral-400">→</span>
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                FILE
              </span>
            </div>

            <div className="mt-3 border-t border-neutral-200 pt-2 text-center text-[10px] font-mono-tech dark:border-neutral-800">
              {isNetwork ? (
                <div className="flex items-center justify-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Wifi className="h-3 w-3" />
                  <span>NETWORK · DIRECT WIRE (DoH)</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <ServerOff className="h-3 w-3" />
                  <span>NETWORK · NOT USED</span>
                </div>
              )}
            </div>
          </div>

          {/* Privacy statement copy from spec */}
          <p className="text-[11px] leading-relaxed text-neutral-500">
            Every tool works this way. Network tools are the rare exception, and explicitly stated on
            their own workbench page.
          </p>
        </div>

        {/* Bottom guarantee */}
        <div className="border-t border-neutral-200 pt-3 text-[10px] text-neutral-400 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero Remote Storage</span>
          </div>
          <p className="mt-1 leading-normal">
            No session cookies, no server-side telemetry, no remote retention.
          </p>
        </div>
      </div>
    </aside>
  );
};
