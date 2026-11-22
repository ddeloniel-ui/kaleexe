import React from 'react';
import { REMINDERS } from '../../data/content';
import { usePixelTypewriter } from '../../hooks/usePixelTypewriter';
import { PixelHeart } from '../PixelIcons';

interface RemindersScreenProps {
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onBack: () => void;
  onGoToFinal: () => void;
}

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  index,
  onPrev,
  onNext,
  onBack,
  onGoToFinal,
}) => {
  const safeIndex = Math.max(0, Math.min(REMINDERS.length - 1, index));
  const text = REMINDERS[safeIndex];
  const { typedText, isDone, finishNow } = usePixelTypewriter(text, 24, safeIndex);
  const formattedNumber = String(safeIndex + 1).padStart(2, '0');
  const isLast = safeIndex === REMINDERS.length - 1;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      {/* Header counter */}
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1">
        <span className="font-pixel-display text-[9px] font-bold">
          REMINDER {formattedNumber} / {REMINDERS.length}
        </span>
        <PixelHeart className="w-3 h-3" />
      </div>

      {/* Message Body */}
      <div
        onClick={() => {
          if (!isDone) finishNow();
        }}
        className="flex-1 flex flex-col justify-center px-1 py-1.5 overflow-y-auto lcd-scroll cursor-pointer"
      >
        <p className="font-pixel-body text-[17px] leading-[1.18] tracking-tight">
          {typedText}
          {!isDone && (
            <span className="inline-block w-1.5 h-3.5 bg-[#1A2417] align-middle ml-0.5 animate-pixel-blink" />
          )}
        </p>
      </div>

      {/* Navigation Softkeys */}
      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        <button
          type="button"
          onClick={onPrev}
          disabled={safeIndex === 0}
          className="disabled:opacity-35 hover:underline cursor-pointer"
        >
          &lt; PREV
        </button>

        {isLast && isDone ? (
          <button
            type="button"
            onClick={onGoToFinal}
            className="bg-[#1A2417] text-[#97AD88] px-1.5 py-0.5 cursor-pointer"
          >
            NEW CHAPTER ♥
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!isDone) finishNow();
              else onNext();
            }}
            className="hover:underline cursor-pointer"
          >
            {isDone ? 'NEXT >' : 'READ ALL'}
          </button>
        )}

        <button type="button" onClick={onBack} className="hover:underline cursor-pointer">
          BACK
        </button>
      </div>
    </div>
  );
};
