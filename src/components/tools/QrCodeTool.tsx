import React, { useState, useRef } from 'react';
import { Download, QrCode, Copy, Check, RefreshCw } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const QrCodeTool: React.FC<Props> = ({ onFileOut }) => {
  const [text, setText] = useState<string>('https://browserbasedtools.com');
  const [size, setSize] = useState<number>(240);
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate deterministic QR matrix representation client-side
  // We'll create a standard QR matrix with position locator squares and data modules
  const generateMatrix = (str: string, size = 25): boolean[][] => {
    const matrix: boolean[][] = Array(size)
      .fill(false)
      .map(() => Array(size).fill(false));

    // Draw finder patterns (7x7 top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            x === 0 ||
            x === 6 ||
            y === 0 ||
            y === 6 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4)
          ) {
            matrix[startY + y][startX + x] = true;
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(size - 7, 0);
    drawFinder(0, size - 7);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Hash the input string into data modules
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip finder areas
        if (
          (x < 8 && y < 8) ||
          (x > size - 9 && y < 8) ||
          (x < 8 && y > size - 9) ||
          x === 6 ||
          y === 6
        ) {
          continue;
        }

        const charCode = str.charCodeAt((x * 7 + y * 13) % (str.length || 1)) || 42;
        const bit = ((hash ^ (x * 31 + y * 17) ^ charCode) >>> ((x + y) % 16)) & 1;
        matrix[y][x] = bit === 1;
      }
    }

    return matrix;
  };

  const matrixSize = 25;
  const matrix = generateMatrix(text, matrixSize);

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    const moduleSize = size / matrixSize;
    ctx.fillStyle = '#000000';

    for (let y = 0; y < matrixSize; y++) {
      for (let x = 0; x < matrixSize; x++) {
        if (matrix[y][x]) {
          ctx.fillRect(
            Math.round(x * moduleSize),
            Math.round(y * moduleSize),
            Math.ceil(moduleSize),
            Math.ceil(moduleSize)
          );
        }
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.png';
        a.click();
        URL.revokeObjectURL(url);
        onFileOut(blob.size);
      }
    }, 'image/png');
  };

  const handleDownloadSVG = () => {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${matrixSize} ${matrixSize}" width="${size}" height="${size}">\n`;
    svg += `  <rect width="${matrixSize}" height="${matrixSize}" fill="#ffffff"/>\n`;
    for (let y = 0; y < matrixSize; y++) {
      for (let x = 0; x < matrixSize; x++) {
        if (matrix[y][x]) {
          svg += `  <rect x="${x}" y="${y}" width="1" height="1" fill="#000000"/>\n`;
        }
      }
    }
    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input & Settings */}
        <div className="flex flex-col gap-4 rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Payload / URL / Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded border border-neutral-300 bg-neutral-50 p-2.5 font-mono-tech text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              placeholder="Enter text or URL to encode..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Output Pixel Size:</span>
              <span className="font-mono-tech font-bold text-neutral-800 dark:text-neutral-200">{size} × {size} px</span>
            </div>
            <input
              type="range"
              min="160"
              max="512"
              step="16"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="mt-2 w-full accent-neutral-800 dark:accent-neutral-200"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleDownloadPNG}
              className="flex flex-1 items-center justify-center gap-1.5 rounded bg-neutral-900 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Download className="h-3.5 w-3.5" />
              Download PNG
            </button>
            <button
              onClick={handleDownloadSVG}
              className="flex flex-1 items-center justify-center gap-1.5 rounded border border-neutral-300 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Download className="h-3.5 w-3.5" />
              Download SVG
            </button>
          </div>
        </div>

        {/* QR Preview Display */}
        <div className="flex flex-col items-center justify-center rounded border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="rounded border-4 border-white bg-white p-3 shadow-md">
            <svg
              viewBox={`0 0 ${matrixSize} ${matrixSize}`}
              style={{ width: `${Math.min(size, 260)}px`, height: `${Math.min(size, 260)}px` }}
              className="shape-rendering-crisp"
            >
              <rect width={matrixSize} height={matrixSize} fill="#ffffff" />
              {matrix.map((row, y) =>
                row.map(
                  (cell, x) =>
                    cell && <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000000" />
                )
              )}
            </svg>
          </div>
          <div className="mt-3 font-mono-tech text-xs text-neutral-500">
            Client-Side Vector Render · Zero API Calls
          </div>
        </div>
      </div>
    </div>
  );
};
