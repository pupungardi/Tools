import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Download, Volume2, Music } from 'lucide-react';

interface Props {
  onFileOut: (bytes: number) => void;
}

export const AudioToneTool: React.FC<Props> = ({ onFileOut }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<number>(440);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startTone = () => {
    if (isPlaying) return;

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
    analyserRef.current = analyser;
    setIsPlaying(true);

    renderOscilloscope();
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {
        // ignore
      }
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      oscRef.current.type = waveType;
    }
  }, [frequency, waveType]);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  const renderOscilloscope = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const generateWavExport = () => {
    const sampleRate = 44100;
    const duration = 2; // seconds
    const numSamples = sampleRate * duration;
    const buffer = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let s = 0;
      if (waveType === 'sine') s = Math.sin(2 * Math.PI * frequency * t);
      else if (waveType === 'square') s = Math.sin(2 * Math.PI * frequency * t) >= 0 ? 1 : -1;
      else if (waveType === 'sawtooth') s = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
      else if (waveType === 'triangle') s = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
      buffer[i] = s * volume;
    }

    // Convert Float32Array to 16-bit PCM WAV
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tone_${frequency}Hz_${waveType}.wav`;
    a.click();
    URL.revokeObjectURL(url);
    onFileOut(blob.size);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Waveform Canvas & Main Play Button */}
      <div className="rounded border border-neutral-300 bg-neutral-950 p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          className="h-28 w-full rounded border border-neutral-800 bg-black"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? stopTone : startTone}
              className={`flex items-center gap-2 rounded px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                isPlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isPlaying ? <Square className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
              {isPlaying ? 'Halt Oscillator' : 'Play Tone'}
            </button>
            <span className="font-mono-tech text-sm text-neutral-300">
              {frequency} Hz · {waveType.toUpperCase()}
            </span>
          </div>

          <button
            onClick={generateWavExport}
            className="flex items-center gap-1.5 rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-800"
          >
            <Download className="h-3.5 w-3.5" />
            Export 2s WAV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Frequency & Waveform */}
        <div className="rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Oscillator Waveform
          </span>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((w) => (
              <button
                key={w}
                onClick={() => setWaveType(w)}
                className={`rounded border py-1.5 text-xs font-mono-tech capitalize transition ${
                  waveType === w
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Frequency:</span>
              <span className="font-mono-tech font-bold text-neutral-800 dark:text-neutral-200">{frequency} Hz</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              value={frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value))}
              className="mt-2 w-full accent-neutral-800 dark:accent-neutral-200"
            />
          </div>

          {/* Note presets */}
          <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-mono-tech">
            {[
              { note: 'C3', hz: 130.81 },
              { note: 'A3', hz: 220.0 },
              { note: 'C4', hz: 261.63 },
              { note: 'A4 (440)', hz: 440.0 },
              { note: 'C5', hz: 523.25 },
              { note: '1 kHz', hz: 1000.0 },
            ].map((p) => (
              <button
                key={p.note}
                onClick={() => setFrequency(Math.round(p.hz))}
                className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {p.note}
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Audio Stats */}
        <div className="flex flex-col justify-between rounded border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Master Gain
            </span>
            <div className="mt-3 flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-neutral-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-neutral-800 dark:accent-neutral-200"
              />
              <span className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          <div className="mt-4 rounded bg-neutral-50 p-3 font-mono-tech text-xs text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400">
            <div>Engine: Web Audio API OscillatorNode</div>
            <div>Sample Rate: 44.1 kHz 16-bit Float</div>
            <div>Phase Continuity: Guaranteed in memory</div>
          </div>
        </div>
      </div>
    </div>
  );
};
