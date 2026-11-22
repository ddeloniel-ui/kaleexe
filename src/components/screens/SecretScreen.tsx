import React, { useEffect, useRef } from 'react';
import { SECRET_MESSAGE_TEXT } from '../../data/content';
import { usePixelTypewriter } from '../../hooks/usePixelTypewriter';
import { PixelHeart, PixelLock, PixelNokiaHug } from '../PixelIcons';

interface SecretScreenProps {
  unlocked: boolean;
  justUnlocked: boolean;
  pinInput: string;
  pinError: boolean;
  onDeletePinDigit: () => void;
  scrollSignal: number;
  scrollDirection: 'up' | 'down' | null;
  onBack: () => void;
  onGoToFinal: () => void;
}

export const SecretScreen: React.FC<SecretScreenProps> = ({
  unlocked,
  justUnlocked,
  pinInput,
  pinError,
  onDeletePinDigit,
  scrollSignal,
  scrollDirection,
  onBack,
  onGoToFinal,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { typedText, isDone, finishNow } = usePixelTypewriter(
    unlocked ? SECRET_MESSAGE_TEXT : '',
    22,
    unlocked ? 'unlocked' : 'locked'
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !scrollDirection) return;
    el.scrollBy({
      top: scrollDirection === 'down' ? 40 : -40,
      behavior: 'smooth',
    });
  }, [scrollSignal, scrollDirection]);

  if (!unlocked) {
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 font-pixel-display text-[9px]">
          <span>SECRET MESSAGE</span>
          <PixelLock unlocked={false} className="w-3 h-3" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 gap-2">
          <PixelLock unlocked={false} className="w-5 h-5" />
          <p className="font-pixel-display text-[9px] tracking-wide">
            ENTER CODE
          </p>

          {/* 4-digit Nokia PIN slots */}
          <div className="flex items-center justify-center gap-1.5 my-0.5">
            {[0, 1, 2, 3].map((slot) => {
              const char = pinInput[slot];
              const isCurrent = slot === pinInput.length;
              return (
                <div
                  key={slot}
                  className={`w-6 h-7 border flex items-center justify-center font-pixel-display text-[12px] ${
                    pinError
                      ? 'border-[#1A2417] bg-[#1A2417] text-[#9EB3A3]'
                      : isCurrent
                      ? 'border-[#1A2417] bg-[#1A2417]/15'
                      : 'border-[#1A2417]/60'
                  }`}
                >
                  {char ? char : isCurrent ? <span className="animate-pixel-blink">_</span> : ' '}
                </div>
              );
            })}
          </div>

          <p className="font-pixel-body text-[14px] leading-tight">
            {pinError
              ? 'Wrong code! Try 1234'
              : 'Use keypad to enter 1234'}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={onDeletePinDigit}
            disabled={pinInput.length === 0}
            className="disabled:opacity-35 hover:underline cursor-pointer"
          >
            CLEAR
          </button>
          <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
            BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none ${
        justUnlocked ? 'animate-lcd-flicker' : ''
      }`}
    >
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1">
        <span className="font-pixel-display text-[8px] font-bold">
          SECRET MESSAGE UNLOCKED.
        </span>
        <PixelHeart className="w-3 h-3" />
      </div>

      <div
        ref={scrollRef}
        onClick={() => {
          if (!isDone) finishNow();
        }}
        className="flex-1 overflow-y-auto lcd-scroll py-1.5 pr-1 cursor-pointer"
      >
        <p className="font-pixel-body text-[15px] leading-[1.18] whitespace-pre-wrap">
          {typedText}
          {!isDone && (
            <span className="inline-block w-1.5 h-3 bg-[#1A2417] align-middle ml-0.5 animate-pixel-blink" />
          )}
        </p>
        {isDone && (
          <div className="flex justify-center mt-2 pt-1.5 border-t border-[#1A2417]/20">
            <PixelNokiaHug className="w-20 h-12" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        <button type="button" onClick={onGoToFinal} className="hover:underline cursor-pointer">
          NEW CHAPTER ♥
        </button>
        <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
          BACK
        </button>
      </div>
    </div>
  );
};
