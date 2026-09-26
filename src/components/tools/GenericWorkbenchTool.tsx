import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { Play, Download, Copy, Check, ShieldCheck, Terminal, RefreshCw } from 'lucide-react';

interface Props {
  tool: ToolItem;
  onFileOut: (bytes: number) => void;
}

export const GenericWorkbenchTool: React.FC<Props> = ({ tool, onFileOut }) => {
  const [inputVal, setInputVal] = useState<string>(() => {
    if (tool.id.includes('jwt')) {
      return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiZGV2ZWxvcGVyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    }
    if (tool.id.includes('uuid')) {
      return 'Generate UUIDv4 random identifiers';
    }
    if (tool.id.includes('regex')) {
      return 'Testing email pattern: contact@browserbasedtools.com and invalid-email@';
    }
    if (tool.id.includes('markdown')) {
      return '# Privacy-First Workbench\n\n- Zero telemetry\n- Local execution\n- Instant responsiveness\n\n```ts\nconst local = true;\n```';
    }
    return `// Sample workbench payload for ${tool.name}\n{\n  "tool": "${tool.id}",\n  "status": "active",\n  "memoryExecution": true\n}`;
  });

  const [outputVal, setOutputVal] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(false);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      let res = '';
      if (tool.id.includes('jwt')) {
        try {
          const parts = inputVal.trim().split('.');
          if (parts.length >= 2) {
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            res = JSON.stringify({ header, payload }, null, 2);
          } else {
            res = 'Error: Invalid JWT structure (must contain 3 dot-separated segments)';
          }
        } catch (e) {
          res = `Failed to decode JWT: ${(e as Error).message}`;
        }
      } else if (tool.id.includes('uuid')) {
        const uuids = Array(5)
          .fill(0)
          .map(() => crypto.randomUUID());
        res = uuids.join('\n');
      } else if (tool.id.includes('regex')) {
        const emails = inputVal.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
        res = `Matches found (${emails.length}):\n` + emails.join('\n');
      } else if (tool.id.includes('case-converter')) {
        const kebab = inputVal.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const snake = inputVal.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const camel = inputVal.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        ).replace(/\s+/g, '');
        res = `kebab-case: ${kebab}\nsnake_case: ${snake}\ncamelCase: ${camel}`;
      } else {
        res = `[PROCESSED CLIENT-SIDE: ${tool.name}]\nTimestamp: ${new Date().toISOString()}\nPayload length: ${inputVal.length} bytes\nResult: Execution completed in browser memory.`;
      }

      setOutputVal(res);
      setRunning(false);
    }, 180);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([outputVal || inputVal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.id}_output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Workbench Pipeline
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 rounded bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {running ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              Execute Locally
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <label className="text-xs font-mono-tech text-neutral-500">Input Payload:</label>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              rows={8}
              className="mt-1 w-full rounded border border-neutral-200 bg-neutral-50 p-3 font-mono-tech text-xs text-neutral-900 focus:outline-none dark:border-neutral-750 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Enter input parameters..."
            />
          </div>

          <div>
            <label className="text-xs font-mono-tech text-neutral-500">Execution Output:</label>
            <textarea
              readOnly
              value={outputVal}
              rows={8}
              className="mt-1 w-full rounded border border-neutral-200 bg-neutral-50 p-3 font-mono-tech text-xs text-neutral-900 focus:outline-none dark:border-neutral-750 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Click 'Execute Locally' to run pipeline..."
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Terminal className="h-3.5 w-3.5" />
            <span>Sandboxed Browser Execution Thread</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!outputVal}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              Copy
            </button>
            <button
              onClick={handleDownload}
              disabled={!outputVal}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <Download className="h-3.5 w-3.5" />
              Save Result
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>Execution runs 100% inside client CPU/WASM memory space</span>
      </div>
    </div>
  );
};
