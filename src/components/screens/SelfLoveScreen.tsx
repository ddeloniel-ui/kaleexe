import React, { useEffect, useState } from 'react';
import {
  BREAK_PROMPTS,
  SELF_LOVE_MENU_ITEMS,
  WORTH_AFFIRMATIONS,
} from '../../data/content';
import { PlaylistTrack, ScreenRoute } from '../../types';
import { PixelHeart, PixelMusicNote, PixelNokiaHug, PixelTeaCup } from '../PixelIcons';

interface SelfLoveScreenProps {
  route:
    | 'self_love'
    | 'self_love_breath'
    | 'self_love_song'
    | 'self_love_three_things'
    | 'self_love_break'
    | 'self_love_worth';
  menuIndex: number;
  onSelectMenuIndex: (idx: number) => void;
  onNavigate: (route: ScreenRoute) => void;
  onBackToMenu: () => void;
  // Music integration for option 2
  currentTrack: PlaylistTrack;
  isMusicPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  // Worth card index
  worthIndex: number;
  onNextWorth: () => void;
  onPrevWorth: () => void;
}

export const SelfLoveScreen: React.FC<SelfLoveScreenProps> = ({
  route,
  menuIndex,
  onSelectMenuIndex,
  onNavigate,
  onBackToMenu,
  currentTrack,
  isMusicPlaying,
  onTogglePlay,
  onNextTrack,
  worthIndex,
  onNextWorth,
  onPrevWorth,
}) => {
  // Breathing cycle state (4s in, 4s hold, 4s out)
  const [breathTick, setBreathTick] = useState(0);
  // Three good things persistent entries
  const [threeThings, setThreeThings] = useState<[string, string, string]>(() => {
    try {
      const saved = localStorage.getItem('kale_three_good_things');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          return [String(parsed[0] || ''), String(parsed[1] || ''), String(parsed[2] || '')];
        }
      }
    } catch {
      // ignore storage errors
    }
    return ['', '', ''];
  });
  const [savedNotice, setSavedNotice] = useState(false);

  // Break timer state
  const [breakSeconds, setBreakSeconds] = useState(60);
  const [breakRunning, setBreakRunning] = useState(true);
  const [breakTipIdx, setBreakTipIdx] = useState(0);

  useEffect(() => {
    if (route !== 'self_love_breath') return;
    setBreathTick(0);
    const id = window.setInterval(() => {
      setBreathTick((t) => (t + 1) % 12);
    }, 1000);
    return () => window.clearInterval(id);
  }, [route]);

  useEffect(() => {
    if (route !== 'self_love_break' || !breakRunning) return;
    const id = window.setInterval(() => {
      setBreakSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [route, breakRunning]);

  const updateThing = (idx: 0 | 1 | 2, val: string) => {
    const next: [string, string, string] = [...threeThings] as [string, string, string];
    next[idx] = val;
    setThreeThings(next);
    try {
      localStorage.setItem('kale_three_good_things', JSON.stringify(next));
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 1200);
    } catch {
      // ignore
    }
  };

  if (route === 'self_love') {
    const subRoutes: ScreenRoute[] = [
      'self_love_breath',
      'self_love_song',
      'self_love_three_things',
      'self_love_break',
      'self_love_worth',
    ];
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="border-b border-[#1A2417]/30 pb-1">
          <div className="font-pixel-display text-[8px] font-bold leading-tight">
            WELCOME TO SELF-LOVE MODE.
          </div>
        </div>

        <div className="flex-1 overflow-y-auto lcd-scroll my-1 space-y-0.5 pr-0.5">
          {SELF_LOVE_MENU_ITEMS.map((item, idx) => {
            const isSelected = idx === menuIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectMenuIndex(idx);
                  onNavigate(subRoutes[idx]);
                }}
                className={`w-full text-left px-1.5 py-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A2417] text-[#97AD88]'
                    : 'text-[#1A2417] hover:bg-[#1A2417]/10'
                }`}
              >
                <span className="font-pixel-body text-[14px] leading-tight block truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => onNavigate(subRoutes[menuIndex])}
            className="hover:underline cursor-pointer"
          >
            SELECT
          </button>
          <button type="button" onClick={onBackToMenu} className="hover:underline cursor-pointer">
            BACK
          </button>
        </div>
      </div>
    );
  }

  if (route === 'self_love_breath') {
    const phase =
      breathTick < 4 ? 'Breathe in...' : breathTick < 8 ? 'Hold...' : 'Breathe out...';
    const scaleClass =
      breathTick < 4
        ? 'scale-110'
        : breathTick < 8
        ? 'scale-110'
        : 'scale-75';

    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
          <span>TAKE A DEEP BREATH</span>
          <span>4·4·4</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-1.5">
          <p className="font-pixel-body text-[14px] leading-tight">
            Slow down for a moment.
          </p>

          <div className="my-1 flex items-center justify-center h-12">
            <div
              className={`w-10 h-10 rounded-full border-2 border-[#1A2417] bg-[#1A2417]/15 flex items-center justify-center transition-transform duration-1000 ${scaleClass}`}
            >
              <PixelHeart className="w-4 h-4" />
            </div>
          </div>

          <p className="font-pixel-display text-[10px] tracking-wide font-bold">
            {phase}
          </p>

          <p className="font-pixel-body text-[13px] leading-tight opacity-85">
            You don&apos;t have to solve everything right now.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => setBreathTick(0)}
            className="hover:underline cursor-pointer"
          >
            RESTART
          </button>
          <button
            type="button"
            onClick={() => onNavigate('self_love')}
            className="hover:underline cursor-pointer"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  if (route === 'self_love_song') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
          <span>FAVORITE SONG</span>
          <PixelMusicNote className={`w-3 h-3 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-2">
          <p className="font-pixel-body text-[14px] leading-tight">
            Let something gentle play in the background while you breathe.
          </p>
          <div className="w-full border border-[#1A2417]/35 px-2 py-1.5 bg-[#1A2417]/5">
            <div className="font-pixel-display text-[9px] truncate">{currentTrack.title}</div>
            <div className="font-pixel-body text-[13px] opacity-80 truncate">
              {currentTrack.genre}
            </div>
          </div>
          <div className="flex items-center gap-2 font-pixel-display text-[8px]">
            <button
              type="button"
              onClick={onTogglePlay}
              className="px-2 py-1 bg-[#1A2417] text-[#97AD88] cursor-pointer"
            >
              {isMusicPlaying ? 'PAUSE' : 'PLAY NOW'}
            </button>
            <button
              type="button"
              onClick={onNextTrack}
              className="px-2 py-1 border border-[#1A2417] cursor-pointer"
            >
              NEXT TRACK
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => onNavigate('music')}
            className="hover:underline cursor-pointer"
          >
            FULL PLAYER
          </button>
          <button
            type="button"
            onClick={() => onNavigate('self_love')}
            className="hover:underline cursor-pointer"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  if (route === 'self_love_three_things') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417]">
        <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
          <span>THREE GOOD THINGS</span>
          <span>{savedNotice ? 'SAVED' : 'TODAY'}</span>
        </div>

        <div className="flex-1 overflow-y-auto lcd-scroll py-1 space-y-1">
          {[0, 1, 2].map((idx) => (
            <label key={idx} className="flex items-center gap-1 border-b border-[#1A2417]/25 pb-0.5">
              <span className="font-pixel-display text-[9px] shrink-0">{idx + 1}.</span>
              <input
                type="text"
                value={threeThings[idx]}
                onChange={(e) => updateThing(idx as 0 | 1 | 2, e.target.value)}
                placeholder={
                  idx === 0
                    ? 'good coffee or warm sun...'
                    : idx === 1
                    ? 'a quiet moment...'
                    : 'something you did today...'
                }
                className="w-full bg-transparent font-pixel-body text-[14px] leading-none text-[#1A2417] placeholder:text-[#1A2417]/40 focus:outline-none"
              />
            </label>
          ))}
          <p className="font-pixel-body text-[14px] leading-tight pt-1 text-center">
            Small things count, too.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => {
              setThreeThings(['', '', '']);
              try {
                localStorage.removeItem('kale_three_good_things');
              } catch {
                // ignore
              }
            }}
            className="hover:underline cursor-pointer"
          >
            CLEAR
          </button>
          <button
            type="button"
            onClick={() => onNavigate('self_love')}
            className="hover:underline cursor-pointer"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  if (route === 'self_love_break') {
    const mins = String(Math.floor(breakSeconds / 60)).padStart(2, '0');
    const secs = String(breakSeconds % 60).padStart(2, '0');
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
          <span>TAKE A LITTLE BREAK</span>
          <span>
            {mins}:{secs}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-1.5">
          <PixelTeaCup className="w-7 h-7" />
          <p className="font-pixel-body text-[15px] leading-[1.15]">
            {breakSeconds === 0
              ? 'Hope that tiny pause felt a little lighter, Kale. ♥'
              : BREAK_PROMPTS[breakTipIdx]}
          </p>
          <button
            type="button"
            onClick={() => setBreakTipIdx((i) => (i + 1) % BREAK_PROMPTS.length)}
            className="font-pixel-display text-[8px] border border-[#1A2417]/50 px-1.5 py-0.5 hover:bg-[#1A2417]/10 cursor-pointer"
          >
            NEXT TIP
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => {
              if (breakSeconds === 0) {
                setBreakSeconds(60);
                setBreakRunning(true);
              } else {
                setBreakRunning((r) => !r);
              }
            }}
            className="hover:underline cursor-pointer"
          >
            {breakSeconds === 0 ? 'AGAIN' : breakRunning ? 'PAUSE' : 'RESUME'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('self_love')}
            className="hover:underline cursor-pointer"
          >
            BACK
          </button>
        </div>
      </div>
    );
  }

  // self_love_worth
  const safeWorthIdx = Math.max(0, Math.min(WORTH_AFFIRMATIONS.length - 1, worthIndex));
  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[8px]">
        <span>YOUR WORTH</span>
        <span>
          {safeWorthIdx + 1}/{WORTH_AFFIRMATIONS.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-1.5">
        <PixelNokiaHug className="w-20 h-12" />
        <p className="font-pixel-body text-[15px] leading-[1.15]">
          {WORTH_AFFIRMATIONS[safeWorthIdx]}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        <button type="button" onClick={onPrevWorth} className="hover:underline cursor-pointer">
          &lt; PREV
        </button>
        <button type="button" onClick={onNextWorth} className="hover:underline cursor-pointer">
          NEXT &gt;
        </button>
        <button
          type="button"
          onClick={() => onNavigate('self_love')}
          className="hover:underline cursor-pointer"
        >
          BACK
        </button>
      </div>
    </div>
  );
};
