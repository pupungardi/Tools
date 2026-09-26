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
  const [showToolView, setShowToolView] = useState<boolean>(!!activeTool);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`;
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
      {/* Subheader bar matching video frame 00:04: DESK (left) | [ ] (right) */}
      <div className="flex h-10 items-center justify-between border-b border-neutral-200 bg-white px-4 text-xs dark:border-neutral-800 dark:bg-neutral-950">
        <span className="font-semibold uppercase tracking-widest text-neutral-400">
          DESK
        </span>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          aria-label="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
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
        /* Spotlight Desk Overview (Exact Match with Frame 00:04) */
        <div className="flex flex-col p-4">
          {/* Top Line: 100% Client-Side Processing (left) | 106 tools · 13 sets (right) */}
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono-tech">
            <span>100% Client-Side Processing</span>
            <span>106 tools · 13 sets</span>
          </div>

          {/* Heading */}
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Privacy-First Online Tools
          </h1>

          {/* Description */}
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Free, secure, client-side tools for document conversion, media processing, image editing, and more. All processing happens in your browser - your files never leave your device.
          </p>

          {/* 4 Cards Grid (2x2) */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Card 1: Tools 106 */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="text-xs text-neutral-500">Tools</div>
              <div className="mt-2 font-mono-tech text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                106
              </div>
            </div>

            {/* Card 2: Sets 13 */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="text-xs text-neutral-500">Sets</div>
              <div className="mt-2 font-mono-tech text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                13
              </div>
            </div>

            {/* Card 3: Upload step None */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="text-xs text-neutral-500">Upload step</div>
              <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                None
              </div>
            </div>

            {/* Card 4: Account None */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="text-xs text-neutral-500">Account</div>
              <div className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                None
              </div>
            </div>
          </div>

          {/* Card 5: Files out (full width) */}
          <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
            <div className="text-xs text-neutral-500">Files out</div>
            <div className="mt-2 font-mono-tech text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatBytes(filesOutBytes)}
            </div>
          </div>

          {/* In use now / Spotlight section header */}
          <div className="mt-8 flex items-center justify-between border-b border-neutral-200 pb-2 text-xs dark:border-neutral-800">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              In use now
            </span>
            <span className="font-mono-tech text-neutral-400">
              Spotlight
            </span>
          </div>

          {/* Spotlight tools list */}
          <div className="mt-3 flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
            {spotlightTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.id);
                  setShowToolView(true);
                }}
                className="flex cursor-pointer items-center justify-between py-3 active:bg-neutral-100 dark:active:bg-neutral-900"
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
      )}
    </div>
  );
};
