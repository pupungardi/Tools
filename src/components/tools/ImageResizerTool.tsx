import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Lock, Unlock, Image as ImageIcon, Check } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const ImageResizerTool: React.FC<Props> = ({ onFileOut }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState<number>(90);
  const [processing, setProcessing] = useState<boolean>(false);
  const [exported, setExported] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processLoadedFile(f);
  };

  const processLoadedFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && origWidth > 0) {
      setHeight(Math.round((val / origWidth) * origHeight));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && origHeight > 0) {
      setWidth(Math.round((val / origHeight) * origWidth));
    }
  };

  const handleExport = () => {
    if (!imageSrc || width <= 0 || height <= 0) return;
    setProcessing(true);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          setProcessing(false);
          if (blob) {
            const ext = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';
            const dlUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = dlUrl;
            a.download = `resized_${width}x${height}.${ext}`;
            a.click();
            URL.revokeObjectURL(dlUrl);

            onFileOut(blob.size);
            setExported(true);
            setTimeout(() => setExported(false), 2000);
          }
        },
        format,
        quality / 100
      );
    };
    img.src = imageSrc;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* File Upload / Drop Area */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) processLoadedFile(f);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50/70 p-12 text-center transition hover:border-neutral-400 hover:bg-neutral-100/70 dark:border-neutral-750 dark:bg-neutral-900/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-850"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="mb-3 rounded-full bg-neutral-200 p-3 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Choose an image or drag & drop here
          </p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            JPEG, PNG, WebP, SVG, AVIF · Retained strictly in local GPU memory
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Preview Image */}
          <div className="flex flex-col items-center justify-center rounded border border-neutral-200 bg-neutral-100/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50 lg:col-span-2">
            <div className="relative max-h-80 max-w-full overflow-hidden rounded border border-neutral-300 bg-white/70 shadow-inner dark:border-neutral-700 dark:bg-neutral-950">
              <img
                src={imageSrc}
                alt="Source preview"
                className="max-h-80 w-auto object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between w-full text-xs text-neutral-500 font-mono-tech">
              <span>Original: {origWidth} × {origHeight} px</span>
              <span>Size: {file ? Math.round(file.size / 1024) : 0} KB</span>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setFile(null);
                }}
                className="text-neutral-700 underline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Dimensions
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono-tech text-neutral-500">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono-tech text-neutral-500">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-neutral-300 bg-neutral-50 px-2.5 py-1.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setLockAspect(!lockAspect)}
                className={`flex items-center gap-1.5 text-xs font-mono-tech ${
                  lockAspect ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400'
                }`}
              >
                {lockAspect ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                {lockAspect ? 'Aspect ratio locked' : 'Free aspect ratio'}
              </button>
              <button
                onClick={() => {
                  setWidth(origWidth);
                  setHeight(origHeight);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Reset
              </button>
            </div>

            {/* Quick scale presets */}
            <div className="flex items-center gap-1.5 pt-1">
              {[0.25, 0.5, 0.75, 1.5, 2].map((scale) => (
                <button
                  key={scale}
                  onClick={() => {
                    setWidth(Math.round(origWidth * scale));
                    setHeight(Math.round(origHeight * scale));
                  }}
                  className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-mono-tech text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {scale}x
                </button>
              ))}
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Format & Compression
            </div>

            <div>
              <label className="text-[11px] text-neutral-500">Output Format</label>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {[
                  { id: 'image/webp', label: 'WebP' },
                  { id: 'image/png', label: 'PNG' },
                  { id: 'image/jpeg', label: 'JPEG' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as typeof format)}
                    className={`rounded border py-1 text-xs font-mono-tech transition ${
                      format === f.id
                        ? 'border-neutral-800 bg-neutral-800 text-white dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {format !== 'image/png' && (
              <div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">Quality:</span>
                  <span className="font-mono-tech font-semibold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="mt-1 w-full accent-neutral-800 dark:accent-neutral-200"
                />
              </div>
            )}

            <button
              onClick={handleExport}
              disabled={processing}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-neutral-900 bg-neutral-900 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : exported ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {processing ? 'Processing in Canvas...' : exported ? 'Exported!' : 'Export & Save Locally'}
            </button>
          </div>
        </div>
      )}

      {/* Info notice */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
        <span>Canvas 2D render engine · Strips EXIF metadata automatically · Zero byte telemetry</span>
      </div>
    </div>
  );
};
