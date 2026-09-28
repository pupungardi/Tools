import React, { useState } from 'react';
import { ALL_TOOLS } from '../../data/toolsData';
import { ToolItem } from '../../types';
import { Maximize2, Minimize2, ArrowUpRight, Star, ChevronLeft } from 'lucide-react';
import { JsonFormatterTool } from '../tools/JsonFormatterTool';
import { ImageResizerTool } from '../tools/ImageResizerTool';
import { PasswordGenTool } from '../tools/PasswordGenTool';
import { ColorContrastTool } from '../tools/ColorContrastTool';
import { HashGeneratorTool } from '../tools/HashGeneratorTool';
import { TimestampTool } from '../tools/TimestampTool';
import { WordCounterTool } from '../tools/WordCounterTool';
import { TextDiffTool } from '../tools/TextDiffTool';
import { AudioToneTool } from '../tools/AudioToneTool';
import { PdfToolkitTool } from '../tools/PdfToolkitTool';
import { AspectRatioTool } from '../tools/AspectRatioTool';
import { Base64Tool } from '../tools/Base64Tool';
import { QrCodeTool } from '../tools/QrCodeTool';
import { DnsLookupTool } from '../tools/DnsLookupTool';
import { GenericWorkbenchTool } from '../tools/GenericWorkbenchTool';

interface Props {
  activeTool: ToolItem | null;
  onSelectTool: (id: string) => void;
  filesOutBytes?: number;
  onFileOut: (bytes: number) => void;
  onClearTool?: () => void;
}

export const MobileDeskView: React.FC<Props> = ({
  activeTool,
  onSelectTool,
  filesOutBytes = 0,
  onFileOut,
  onClearTool,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showToolView, setShowToolView] = useState<boolean>(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(0)}  ${sizes[i]}`;
  };

  const spotlightTools = ALL_TOOLS.filter((t) => t.starred).slice(0, 10);

  const renderToolComponent = (tool: ToolItem) => {
    switch (tool.id) {
      case 'json-formatter':
        return <JsonFormatterTool onFileOut={onFileOut} />;
      case 'image-resizer':
      case 'format-converter':
      case 'exif-stripper':
        return <ImageResizerTool onFileOut={onFileOut} />;
      case 'password-generator':
        return <PasswordGenTool onFileOut={onFileOut} />;
      case 'contrast-checker':
        return <ColorContrastTool onFileOut={onFileOut} />;
      case 'hash-generator':
        return <HashGeneratorTool onFileOut={onFileOut} />;
      case 'timestamp-converter':
        return <TimestampTool onFileOut={onFileOut} />;
      case 'word-counter':
        return <WordCounterTool onFileOut={onFileOut} />;
      case 'text-diff':
        return <TextDiffTool onFileOut={onFileOut} />;
      case 'audio-tone-generator':
        return <AudioToneTool onFileOut={onFileOut} />;
      case 'compress-pdf':
      case 'merge-pdf':
      case 'pdf-to-text':
        return <PdfToolkitTool onFileOut={onFileOut} />;
      case 'aspect-ratio':
        return <AspectRatioTool onFileOut={onFileOut} />;
      case 'base64-tool':
        return <Base64Tool onFileOut={onFileOut} />;
      case 'qr-generator':
        return <QrCodeTool onFileOut={onFileOut} />;
      case 'dns-lookup':
        return <DnsLookupTool onFileOut={onFileOut} />;
      default:
        return <GenericWorkbenchTool tool={tool} onFileOut={onFileOut} />;
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-white dark:bg-neutral-950">
      {/* Subheader bar matching 1. Tool.png: DESK (left) | corner brackets expand icon (right) */}
      <div className="flex h-10 items-center justify-between border-b border-neutral-200 bg-white px-4 text-xs dark:border-neutral-800 dark:bg-neutral-950">
        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
          DESK
        </span>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <svg
              className="h-4 w-4 stroke-[1.8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
            </svg>
          )}
        </button>
      </div>

      {activeTool && showToolView ? (
        /* Active Tool Running Mode */
        <div className="flex flex-col p-4">
          <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <button
              onClick={() => setShowToolView(false)}
              className="flex items-center gap-1 text-xs font-mono-tech text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Desk</span>
            </button>
            <div className="font-mono-tech text-xs text-neutral-400">
              tools/{activeTool.set}/{activeTool.id}
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {activeTool.name}
            </h1>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              {activeTool.description}
            </p>
          </div>

          {renderToolComponent(activeTool)}
        </div>
      ) : (
        /* Spotlight Desk Overview (Exact Match with 1. Tool.png) */
        <div className="flex flex-col p-4">
          {/* Top Line: 100% Client-Side Processing ───────── 106 tools · 13 sets */}
          <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 font-mono-tech">
            <span className="shrink-0">100% Client-Side Processing</span>
            <span className="mx-3.5 flex-1 border-t border-neutral-300 dark:border-neutral-700"></span>
            <span className="shrink-0">106 tools · 13 sets</span>
          </div>

          {/* Heading */}
          <h1 className="mt-3.5 text-[32px] font-bold tracking-tight text-neutral-950 dark:text-neutral-50 leading-[1.15]">
            Privacy-First Online Tools
          </h1>

          {/* Description */}
          <p className="mt-3 text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Free, secure, client-side tools for document conversion, media processing, image editing, and more. All processing happens in your browser - your files never leave your device.
          </p>

          {/* Single Unified 2-Column Stats Card (Exact Match with 1. Tool.png) */}
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="grid grid-cols-2">
              {/* Left Column: Tools, Upload step, Files out */}
              <div className="flex flex-col pr-4">
                <div>
                  <div className="text-[13px] text-neutral-500 font-sans">Tools</div>
                  <div className="mt-1 font-mono-tech text-[28px] font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
                    106
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[13px] text-neutral-500 font-sans">Upload step</div>
                  <div className="mt-1 text-base font-semibold text-neutral-950 dark:text-neutral-50">
                    None
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[13px] text-neutral-500 font-sans">Files out</div>
                  <div className="mt-1 font-mono-tech text-base font-semibold text-neutral-950 dark:text-neutral-50">
                    {filesOutBytes > 0 ? formatBytes(filesOutBytes) : '875  B'}
                  </div>
                </div>
              </div>

              {/* Right Column: Sets, Account (divided by vertical divider line) */}
              <div className="flex flex-col border-l border-neutral-200 pl-6 dark:border-neutral-800">
                <div>
                  <div className="text-[13px] text-neutral-500 font-sans">Sets</div>
                  <div className="mt-1 font-mono-tech text-[28px] font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
                    13
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-[13px] text-neutral-500 font-sans">Account</div>
                  <div className="mt-1 text-base font-semibold text-neutral-950 dark:text-neutral-50">
                    None
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* In use now / Spotlight Card Container (Matching bottom of 1. Tool.png) */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 text-xs dark:border-neutral-800">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                In use now
              </span>
              <span className="font-mono-tech text-neutral-400">
                Spotlight
              </span>
            </div>

            {/* Spotlight tools list */}
            <div className="flex flex-col divide-y divide-neutral-100 px-4 dark:divide-neutral-800/60">
              {spotlightTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    setShowToolView(true);
                  }}
                  className="flex cursor-pointer items-center justify-between py-3 transition active:bg-neutral-50 dark:active:bg-neutral-800/40"
                >
                  <div className="flex flex-col pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {tool.name}
                      </span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
