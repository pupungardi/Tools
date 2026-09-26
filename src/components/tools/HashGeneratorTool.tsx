import React, { useState, useEffect } from 'react';
import { Copy, Check, ShieldCheck, FileCheck, Upload } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const HashGeneratorTool: React.FC<Props> = ({ onFileOut }) => {
  const [text, setText] = useState<string>('The quick brown fox jumps over the lazy dog');
  const [fileMode, setFileMode] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);

  const [hashes, setHashes] = useState<{
    sha256: string;
    sha512: string;
    sha384: string;
    sha1: string;
  }>({ sha256: '', sha512: '', sha384: '', sha1: '' });

  const [verifyHash, setVerifyHash] = useState<string>('');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bufferToHex = (buf: ArrayBuffer) => {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  useEffect(() => {
    const computeHashes = async () => {
      try {
        let buffer: BufferSource;
        if (fileMode && fileBuffer) {
          buffer = fileBuffer;
        } else {
          buffer = new TextEncoder().encode(text);
        }

        const [s256, s512, s384, s1] = await Promise.all([
          window.crypto.subtle.digest('SHA-256', buffer),
          window.crypto.subtle.digest('SHA-512', buffer),
          window.crypto.subtle.digest('SHA-384', buffer),
          window.crypto.subtle.digest('SHA-1', buffer),
        ]);

        setHashes({
          sha256: bufferToHex(s256),
          sha512: bufferToHex(s512),
          sha384: bufferToHex(s384),
          sha1: bufferToHex(s1),
        });
      } catch (e) {
        console.error('Digest error', e);
      }
    };

    computeHashes();
  }, [text, fileMode, fileBuffer]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileMode(true);
      setFileName(f.name);
      setFileSize(f.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result instanceof ArrayBuffer) {
          setFileBuffer(event.target.result);
        }
      };
      reader.readAsArrayBuffer(f);
    }
  };

  const handleCopy = (val: string, key: string) => {
    const formatted = uppercase ? val.toUpperCase() : val.toLowerCase();
    navigator.clipboard.writeText(formatted);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const checkMatch = (val: string) => {
    if (!verifyHash.trim()) return null;
    return val.toLowerCase() === verifyHash.trim().toLowerCase();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode Toggle & Input */}
      <div className="rounded border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFileMode(false);
                setFileBuffer(null);
              }}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                !fileMode
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              Text Input
            </button>
            <button
              onClick={() => setFileMode(true)}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                fileMode
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              File Checksum
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-neutral-500 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded accent-neutral-800 dark:accent-neutral-200"
            />
            <span>UPPERCASE HEX</span>
          </label>
        </div>

        {!fileMode ? (
          <div className="mt-3">
            <label className="text-xs text-neutral-500 font-mono-tech">Input String / Payload:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded border border-neutral-200 bg-neutral-50 p-2.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-750 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Enter text string to hash..."
            />
          </div>
        ) : (
          <div className="mt-3">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900">
              <input type="file" onChange={handleFileUpload} className="hidden" />
              <Upload className="h-6 w-6 text-neutral-400" />
              <span className="mt-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {fileName ? fileName : 'Click to select a file for checksum verification'}
              </span>
              {fileName && (
                <span className="text-[11px] font-mono-tech text-neutral-500">
                  {Math.round(fileSize / 1024)} KB · Evaluated entirely in RAM
                </span>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Verify Against Expected Hash */}
      <div className="rounded border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Verify Against Expected Checksum (Optional)
        </label>
        <input
          type="text"
          value={verifyHash}
          onChange={(e) => setVerifyHash(e.target.value)}
          placeholder="Paste expected hash to compare..."
          className="mt-1.5 w-full rounded border border-neutral-300 bg-neutral-50 px-3 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
        />
      </div>

      {/* Hash Outputs List */}
      <div className="flex flex-col gap-3">
        {[
          { key: 'sha256', name: 'SHA-256', val: hashes.sha256, bits: 256 },
          { key: 'sha512', name: 'SHA-512', val: hashes.sha512, bits: 512 },
          { key: 'sha384', name: 'SHA-384', val: hashes.sha384, bits: 384 },
          { key: 'sha1', name: 'SHA-1 (Legacy)', val: hashes.sha1, bits: 160 },
        ].map((h) => {
          const isMatch = checkMatch(h.val);
          const displayVal = uppercase ? h.val.toUpperCase() : h.val.toLowerCase();

          return (
            <div
              key={h.key}
              className={`rounded border p-3 transition ${
                isMatch === true
                  ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20'
                  : isMatch === false
                  ? 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 opacity-75'
                  : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {h.name} <span className="text-[11px] font-mono-tech text-neutral-400">({h.bits}-bit)</span>
                </span>
                <div className="flex items-center gap-2">
                  {isMatch === true && (
                    <span className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                      <Check className="h-3 w-3" /> MATCH
                    </span>
                  )}
                  {isMatch === false && (
                    <span className="rounded bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      NO MATCH
                    </span>
                  )}
                  <button
                    onClick={() => handleCopy(h.val, h.key)}
                    className="flex items-center gap-1 rounded border border-neutral-300 px-2.5 py-1 text-xs font-mono-tech text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    {copiedKey === h.key ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copiedKey === h.key ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="mt-2 break-all rounded bg-neutral-50 p-2 font-mono-tech text-xs text-neutral-900 dark:bg-neutral-950 dark:text-neutral-200 select-all">
                {displayVal || '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
        <span>Hardware accelerated crypto: window.crypto.subtle.digest · Zero network overhead</span>
      </div>
    </div>
  );
};
