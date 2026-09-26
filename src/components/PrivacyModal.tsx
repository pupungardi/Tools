import React from 'react';
import { X, ShieldCheck, Lock, ServerOff, Cpu } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Privacy Architecture & Terms
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 max-h-96 overflow-y-auto p-5 text-xs text-neutral-600 leading-relaxed dark:text-neutral-300">
          <div className="rounded border border-emerald-300 bg-emerald-50/70 p-3 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
            <span className="font-bold">100% Client-Side / Zero Upload: </span>
            All file processing, conversions, media synthesis, and cryptographic calculations occur
            directly inside your browser sandbox. Your files never touch a remote server.
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Core Privacy Guarantees
            </h3>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>No sign-up or accounts:</strong> Access all tools anonymously.</li>
              <li><strong>No telemetry or tracking:</strong> No Google Analytics, tracking pixels, or third-party behavioral scripts.</li>
              <li><strong>In-memory lifecycle:</strong> Files and passwords remain strictly in ephemeral RAM or WebGPU buffers until discarded.</li>
              <li><strong>Network isolation:</strong> Network tools (such as DNS query) explicitly state external connection points right on their UI.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Terms of Service
            </h3>
            <p>
              Tools are provided &quot;as is&quot; without warranties of any kind. You retain complete ownership
              and responsibility for all data and files processed with these tools. Because operations
              run locally, no logs of your activities exist anywhere on our infrastructure.
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-right dark:border-neutral-800 dark:bg-neutral-950">
          <button
            onClick={onClose}
            className="rounded bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
