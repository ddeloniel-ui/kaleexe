import React, { useEffect, useRef } from 'react';
import { PERSONAL_LETTER } from '../../data/content';
import { usePixelTypewriter } from '../../hooks/usePixelTypewriter';
import { PixelHeart, PixelNokiaHug } from '../PixelIcons';

interface LetterScreenProps {
  scrollSignal: number;
  scrollDirection: 'up' | 'down' | null;
  onBack: () => void;
  onGoToFinal: () => void;
}

export const LetterScreen: React.FC<LetterScreenProps> = ({
  scrollSignal,
  scrollDirection,
  onBack,
  onGoToFinal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { typedText, isDone, finishNow } = usePixelTypewriter(PERSONAL_LETTER, 22, 'letter');

  // Auto-scroll smoothly as typing progresses
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || isDone) return;
    el.scrollTop = el.scrollHeight;
  }, [typedText, isDone]);

  // Keypad Up/Down scrolling support
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !scrollDirection) return;
    el.scrollBy({
      top: scrollDirection === 'down' ? 42 : -42,
      behavior: 'smooth',
    });
  }, [scrollSignal, scrollDirection]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1">
        <span className="font-pixel-display text-[9px] font-bold">A LETTER FOR YOU</span>
        <PixelHeart className="w-3 h-3" />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto lcd-scroll py-1.5 pr-1"
      >
        <div className="font-pixel-body text-[15px] leading-[1.18] whitespace-pre-wrap">
          {typedText}
          <span className="inline-block w-1.5 h-3 bg-[#1A2417] align-middle ml-0.5 animate-pixel-blink" />
        </div>

        {isDone && (
          <div className="flex flex-col items-center gap-1.5 mt-3 pt-2 border-t border-[#1A2417]/25">
            <PixelNokiaHug className="w-20 h-12" />
            <button
              type="button"
              onClick={onGoToFinal}
              className="px-2 py-0.5 bg-[#1A2417] text-[#A1B6A3] font-pixel-display text-[8px] cursor-pointer"
            >
              A NEW CHAPTER ♥
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        {!isDone ? (
          <button type="button" onClick={finishNow} className="hover:underline cursor-pointer">
            READ ALL
          </button>
        ) : (
          <button type="button" onClick={onGoToFinal} className="hover:underline cursor-pointer">
            NEXT CHPT
          </button>
        )}
        <span className="opacity-65">▲▼ SCROLL</span>
        <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
          BACK
        </button>
      </div>
    </div>
  );
};
