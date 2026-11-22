import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { PlaylistTrack } from '../../types';
import { PixelMusicNote } from '../PixelIcons';

interface MusicPlayerScreenProps {
  playlist: PlaylistTrack[];
  trackIndex: number;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
  onChangeVolume: (vol: number) => void;
  onAddCustomTrack: (file: File) => void;
  onBack: () => void;
}

export const MusicPlayerScreen: React.FC<MusicPlayerScreenProps> = ({
  playlist,
  trackIndex,
  isPlaying,
  volume,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
  onChangeVolume,
  onAddCustomTrack,
  onBack,
}) => {
  const track = playlist[trackIndex] ?? playlist[0];
  const [eqBars, setEqBars] = useState<number[]>(() => new Array(10).fill(0.18));
  const [elapsed, setElapsed] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setElapsed(0);
  }, [track.id]);

  useEffect(() => {
    if (!isPlaying) {
      setEqBars(new Array(10).fill(0.12));
      return;
    }

    const eqInterval = window.setInterval(() => {
      const levels = soundEngine.getEqualizerLevels(10);
      // Blend live FFT with gentle fallback cadence in case audio context hasn't populated all bins
      setEqBars(
        levels.map((lvl, idx) =>
          Math.max(0.16, Math.min(1, lvl * 0.85 + 0.15 * Math.abs(Math.sin(Date.now() / 220 + idx))))
        )
      );
    }, 90);

    const timeInterval = window.setInterval(() => {
      const realProgress = soundEngine.getAudioProgress();
      if (realProgress) {
        setElapsed(realProgress.current);
      } else {
        setElapsed((s) => (s + 1 >= track.durationSeconds ? 0 : s + 1));
      }
    }, 500);

    return () => {
      window.clearInterval(eqInterval);
      window.clearInterval(timeInterval);
    };
  }, [isPlaying, track.durationSeconds]);

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
        <div className="flex items-center gap-1">
          <PixelMusicNote className={`w-3 h-3 ${isPlaying ? 'animate-bounce' : ''}`} />
          <span>MUSIC PLAYER</span>
        </div>
        <span>
          {trackIndex + 1}/{playlist.length}
        </span>
      </div>

      {/* Track Info + Equalizer */}
      <div className="flex-1 flex flex-col justify-between py-1 gap-1">
        <div>
          <div className="font-pixel-display text-[10px] font-bold leading-tight truncate">
            {track.title}
          </div>
          <div className="font-pixel-body text-[13px] leading-none opacity-80 truncate">
            {track.artist} · {track.genre}
          </div>
        </div>

        {/* Tiny LCD Equalizer + Waveform Visualizer */}
        <div className="flex items-end justify-between gap-1 h-9 px-1.5 py-1 border border-[#1A2417]/35 bg-[#1A2417]/5">
          {eqBars.map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-[#1A2417] transition-all duration-75"
              style={{ height: `${Math.round(val * 100)}%` }}
            />
          ))}
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-between gap-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={onPrev}
            className="px-1.5 py-0.5 border border-[#1A2417]/50 hover:bg-[#1A2417]/10 cursor-pointer"
            title="Previous track"
          >
            |&lt;
          </button>
          <button
            type="button"
            onClick={onPlayPause}
            className="px-2 py-0.5 bg-[#1A2417] text-[#97AD88] cursor-pointer"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button
            type="button"
            onClick={onStop}
            className="px-1.5 py-0.5 border border-[#1A2417]/50 hover:bg-[#1A2417]/10 cursor-pointer"
          >
            STOP
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-1.5 py-0.5 border border-[#1A2417]/50 hover:bg-[#1A2417]/10 cursor-pointer"
            title="Next track"
          >
            &gt;|
          </button>
        </div>

        {/* Volume Slider + Time */}
        <div className="flex items-center justify-between gap-2 text-[8px] font-pixel-display">
          <span>VOL</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => onChangeVolume(Number(e.target.value) / 100)}
            aria-label="Music volume"
            className="w-full h-1.5 accent-[#1A2417] cursor-pointer"
          />
          <span className="tabular-nums shrink-0">{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Footer + Add Audio Track */}
      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="hover:underline cursor-pointer"
        >
          + ADD MP3
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAddCustomTrack(file);
            e.target.value = '';
          }}
        />
        <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
          BACK
        </button>
      </div>
    </div>
  );
};
