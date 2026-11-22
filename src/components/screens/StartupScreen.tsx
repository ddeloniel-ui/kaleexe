import React, { useEffect, useState } from 'react';
import { PixelBattery, PixelHeart, PixelNokiaHug, PixelSignalBars } from '../PixelIcons';

interface StartupScreenProps {
  onComplete: () => void;
}

export const StartupScreen: React.FC<StartupScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [typedGreeting, setTypedGreeting] = useState('');

  const fullGreeting = 'HEY KALE :)\nYOU HAVE 25 NEW\nREMINDERS.';

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage(1), 450);
    const t2 = window.setTimeout(() => setStage(2), 1650);
    const t3 = window.setTimeout(() => setStage(3), 2350);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (stage < 3) return;
    let idx = 0;
    const interval = window.setInterval(() => {
      idx += 1;
      setTypedGreeting(fullGreeting.slice(0, idx));
      if (idx >= fullGreeting.length) {
        window.clearInterval(interval);
      }
    }, 34);
    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage === 3 && typedGreeting.length === fullGreeting.length) {
      const doneTimer = window.setTimeout(() => {
        onComplete();
      }, 2800);
      return () => window.clearTimeout(doneTimer);
    }
  }, [stage, typedGreeting, onComplete]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 text-[#1A2417] select-none">
      {/* Top status bar appears at stage 2+ */}
      <div
        className={`flex items-center justify-between h-4 transition-opacity duration-500 ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <PixelSignalBars level={4} className="w-3.5 h-2.5" />
          <span className="font-pixel-display text-[8px] tracking-tight">KALE</span>
        </div>
        <PixelBattery bars={4} className="w-4 h-2.5" />
      </div>

      {/* Center boot content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-1">
        {stage === 1 && (
          <div className="flex flex-col items-center gap-1.5 animate-fade-in">
            <span className="font-pixel-display text-base tracking-[0.2em] font-bold">
              NOKIA
            </span>
            <span className="font-pixel-display text-[11px] tracking-[0.18em]">
              KALE
            </span>
            <div className="w-24 h-[1px] bg-[#1A2417]/50 my-0.5" />
            <span className="font-pixel-body text-[15px] leading-tight tracking-wide">
              A NEW CHAPTER STARTS HERE.
            </span>
          </div>
        )}

        {stage === 2 && (
          <div className="flex flex-col items-center gap-2">
            <span className="font-pixel-display text-sm tracking-[0.18em]">
              NOKIA
            </span>
            <PixelHeart className="w-5 h-5" />
          </div>
        )}

        {stage >= 3 && (
          <div className="flex flex-col items-center gap-1.5">
            <pre className="font-pixel-body text-[17px] leading-[1.12] whitespace-pre-wrap text-center">
              {typedGreeting}
              <span className="inline-block w-2 h-3.5 bg-[#1A2417] align-middle ml-0.5 animate-pixel-blink" />
            </pre>
            {typedGreeting.length === fullGreeting.length && (
              <div className="flex items-center justify-center mt-0.5">
                <PixelNokiaHug className="w-20 h-12" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Softkey hint */}
      <div className="flex items-center justify-between h-4 font-pixel-display text-[8px] border-t border-[#1A2417]/25 pt-1">
        <button
          type="button"
          onClick={onComplete}
          className="hover:underline cursor-pointer"
        >
          {stage >= 3 ? 'OPEN MENU' : 'SKIP'}
        </button>
        <span className="opacity-70">002</span>
      </div>
    </div>
  );
};
