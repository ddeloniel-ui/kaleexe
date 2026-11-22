import React, { useEffect, useRef } from 'react';
import { FINAL_MESSAGE_TEXT } from '../../data/content';
import { PixelNokiaHug } from '../PixelIcons';

interface FinalScreenProps {
  scrollSignal: number;
  scrollDirection: 'up' | 'down' | null;
  onReadAgain: () => void;
  onRestartPhone: () => void;
  onTurnOff: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({
  scrollSignal,
  scrollDirection,
  onReadAgain,
  onRestartPhone,
  onTurnOff,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !scrollDirection) return;
    el.scrollBy({
      top: scrollDirection === 'down' ? 40 : -40,
      behavior: 'smooth',
    });
  }, [scrollSignal, scrollDirection]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      <div className="border-b border-[#1A2417]/30 pb-1 text-center">
        <div className="font-pixel-display text-[8px] font-bold leading-tight">
          END OF OLD CHAPTER.
        </div>
        <div className="font-pixel-display text-[8px] leading-tight">
          START OF SOMETHING NEW.
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto lcd-scroll py-1.5 pr-1">
        <div className="flex flex-col items-center mb-1.5">
          <PixelNokiaHug className="w-24 h-14" />
        </div>
        <p className="font-pixel-body text-[15px] leading-[1.18] whitespace-pre-wrap">
          {FINAL_MESSAGE_TEXT}
        </p>
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[7px]">
        <button
          type="button"
          onClick={onReadAgain}
          className="px-1 py-0.5 bg-[#1A2417] text-[#97AD88] cursor-pointer"
        >
          READ AGAIN
        </button>
        <button
          type="button"
          onClick={onRestartPhone}
          className="px-1 py-0.5 border border-[#1A2417]/60 hover:bg-[#1A2417]/10 cursor-pointer"
        >
          RESTART
        </button>
        <button
          type="button"
          onClick={onTurnOff}
          className="px-1 py-0.5 border border-[#1A2417]/60 hover:bg-[#1A2417]/10 cursor-pointer"
        >
          TURN OFF
        </button>
      </div>
    </div>
  );
};
