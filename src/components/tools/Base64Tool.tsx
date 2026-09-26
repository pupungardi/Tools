import React, { useState } from 'react';
import { Copy, Check, ArrowDownUp, Download, Upload } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const Base64Tool: React.FC<Props> = ({ onFileOut }) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('Hello World! Privacy-first browser tools.');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processOutput = (): string => {
    try {
      if (mode === 'encode') {
        const utf8Bytes = new TextEncoder().encode(input);
        let binary = '';
        utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
        let b64 = btoa(binary);
        if (urlSafe) {
          b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        return b64;
      } else {
        let clean = input.trim();
        if (urlSafe) {
          clean = clean.replace(/-/g, '+').replace(/_/g, '/');
          while (clean.length % 4) clean += '=';
        }
        const binary = atob(clean);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
      }
    } catch (e) {
      return '';
    }
  };

  const output = processOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.b64' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`rounded px-3 py-1.5 text-xs font-medium transition ${
              mode === 'encode'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            Encode to Base64
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`rounded px-3 py-1.5 text-xs font-medium transition ${
              mode === 'decode'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            Decode from Base64
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded accent-neutral-800 dark:accent-neutral-200"
            />
            <span>URL-Safe (RFC 4648 §5)</span>
          </label>
        </div>
      </div>

      {/* Input / Output Panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            <span>{mode === 'encode' ? 'Input Text' : 'Base64 Input'}</span>
            <span className="font-mono-tech text-[11px] font-normal">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="w-full resize-y bg-transparent p-3 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100"
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 payload...'}
          />
        </div>

        <div className="flex flex-col rounded border border-neutral-300 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
            <span>{mode === 'encode' ? 'Base64 Result' : 'Decoded Plaintext'}</span>
            <span className="font-mono-tech text-[11px] font-normal">{output.length} chars</span>
          </div>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full resize-y bg-transparent p-3 font-mono-tech text-xs leading-relaxed text-neutral-900 focus:outline-none dark:text-neutral-100 select-all"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
        <div className="text-xs text-neutral-500 font-mono-tech">
          Overhead: {mode === 'encode' ? '+33% bandwidth weight' : 'Uncompressed stream'}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!output}
            className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Output'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!output}
            className="flex items-center gap-1.5 rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Download className="h-3.5 w-3.5" />
            Download File
          </button>
        </div>
      </div>
    </div>
  );
};
