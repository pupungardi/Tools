import React, { useState } from 'react';
import { ToolItem } from '../types';
import { ALL_TOOLS, TOTAL_TOOLS_COUNT, TOTAL_SETS_COUNT } from '../data/toolsData';
import { Copy, Check, Star, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { JsonFormatterTool } from './tools/JsonFormatterTool';
import { ImageResizerTool } from './tools/ImageResizerTool';
import { PasswordGenTool } from './tools/PasswordGenTool';
import { ColorContrastTool } from './tools/ColorContrastTool';
import { HashGeneratorTool } from './tools/HashGeneratorTool';
import { TimestampTool } from './tools/TimestampTool';
import { WordCounterTool } from './tools/WordCounterTool';
import { TextDiffTool } from './tools/TextDiffTool';
import { AudioToneTool } from './tools/AudioToneTool';
import { PdfToolkitTool } from './tools/PdfToolkitTool';
import { AspectRatioTool } from './tools/AspectRatioTool';
import { Base64Tool } from './tools/Base64Tool';
import { QrCodeTool } from './tools/QrCodeTool';
import { DnsLookupTool } from './tools/DnsLookupTool';
import { GenericWorkbenchTool } from './tools/GenericWorkbenchTool';

interface Props {
  activeTool: ToolItem | null;
  onSelectTool: (id: string) => void;
  filesOutBytes: number;
  onFileOut: (bytes: number) => void;
  onCopyPath: () => void;
  pathCopied: boolean;
}

export const DeskPanel: React.FC<Props> = ({
  activeTool,
  onSelectTool,
  filesOutBytes,
  onFileOut,
  onCopyPath,
  pathCopied,
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const starredTools = ALL_TOOLS.filter((t) => t.starred).slice(0, 12);

  // Render the appropriate tool component
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
    <main className="flex flex-1 flex-col overflow-y-auto bg-neutral-50/50 p-4 dark:bg-neutral-950/50 sm:p-6">
      {/* Top Header Bar inside Desk */}
      <div className="flex flex-col gap-3 border-b border-neutral-300 pb-4 dark:border-neutral-800">
        {/* Breadcrumb Path + Copy Path */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono-tech text-xs text-neutral-600 dark:text-neutral-400">
            <span
              onClick={() => onSelectTool('')}
              className="cursor-pointer hover:text-neutral-900 dark:hover:text-white"
            >
              workbench
            </span>
            <span>/</span>
            {activeTool ? (
              <>
                <span className="text-neutral-500">{activeTool.set}</span>
                <span>/</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {activeTool.id}
                </span>
              </>
            ) : (
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">spotlight</span>
            )}
          </div>

          {activeTool && (
            <button
              onClick={onCopyPath}
              className="flex items-center gap-1 rounded border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-mono-tech text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750"
              title="Copy path (⌘⇧C)"
            >
              {pathCopied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span>{pathCopied ? 'Path Copied' : 'Copy Path ⌘⇧C'}</span>
            </button>
          )}
        </div>

        {/* Minimalist Dashboard Stats Bar from Section 2.C */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono-tech text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            Tools <strong className="text-neutral-800 dark:text-neutral-200">{TOTAL_TOOLS_COUNT}</strong>
          </div>
          <span>·</span>
          <div>
            Sets <strong className="text-neutral-800 dark:text-neutral-200">{TOTAL_SETS_COUNT}</strong>
          </div>
          <span>·</span>
          <div>
            Upload step <strong className="text-neutral-800 dark:text-neutral-200">None</strong>
          </div>
          <span>·</span>
          <div>
            Account <strong className="text-neutral-800 dark:text-neutral-200">None</strong>
          </div>
          <span>·</span>
          <div>
            Files out <strong className="text-neutral-800 dark:text-neutral-200">{formatBytes(filesOutBytes)}</strong>
          </div>
        </div>
      </div>

      {/* Main Workbench Body */}
      <div className="mt-6 flex-1">
        {activeTool ? (
          <div className="flex flex-col gap-5">
            {/* Tool Title & Tagline */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {activeTool.name}
                </h1>
                {activeTool.starred && (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                )}
                {activeTool.isNetworkTool ? (
                  <span className="rounded bg-amber-100 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    NETWORK TOOL
                  </span>
                ) : (
                  <span className="rounded bg-neutral-200 px-2 py-0.5 font-mono-tech text-[10px] font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    CLIENT-SIDE
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {activeTool.description}
              </p>
            </div>

            {/* Active Tool Interactive Interface */}
            {renderToolComponent(activeTool)}
          </div>
        ) : (
          /* Spotlight / Idle Grid from Section 2.C */
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  In Use Now / Spotlight
                </h2>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Fast, friction-free browser tools. Pick a utility or press{' '}
                <kbd className="rounded border border-neutral-300 bg-neutral-100 px-1 py-0.5 font-mono-tech text-[10px] dark:border-neutral-700 dark:bg-neutral-800">
                  ⌘K
                </kbd>{' '}
                to search all 106 tools.
              </p>
            </div>

            {/* Grid of Starred / Popular Tools */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {starredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="group flex flex-col justify-between rounded border border-neutral-300 bg-white p-4 text-left transition hover:border-neutral-500 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-400">
                        {tool.set}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-neutral-500" />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-neutral-900 group-hover:text-neutral-950 dark:text-neutral-100 dark:group-hover:text-white">
                      {tool.name}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500 leading-normal">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-2 text-[10px] font-mono-tech text-neutral-400 dark:border-neutral-800">
                    <span>{tool.runsLocally ? 'Local engine' : 'Direct DoH'}</span>
                    <span>★ popular</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
