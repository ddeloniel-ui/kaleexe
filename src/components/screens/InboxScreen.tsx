import React from 'react';
import { INBOX_MESSAGES } from '../../data/content';
import { usePixelTypewriter } from '../../hooks/usePixelTypewriter';
import { PixelEnvelope } from '../PixelIcons';

interface InboxScreenProps {
  mode: 'list' | 'detail';
  selectedIndex: number;
  readIds: string[];
  onSelectIndex: (idx: number) => void;
  onOpenMessage: (idx: number) => void;
  onBackToList: () => void;
  onBackToMenu: () => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({
  mode,
  selectedIndex,
  readIds,
  onSelectIndex,
  onOpenMessage,
  onBackToList,
  onBackToMenu,
}) => {
  const currentMsg = INBOX_MESSAGES[selectedIndex] ?? INBOX_MESSAGES[0];
  const { typedText, isDone, finishNow } = usePixelTypewriter(
    mode === 'detail' ? currentMsg.body : '',
    20,
    `${mode}-${currentMsg.id}`
  );

  if (mode === 'detail') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
        <div className="border-b border-[#1A2417]/30 pb-1">
          <div className="flex items-center justify-between font-pixel-display text-[8px]">
            <span>MSG {currentMsg.number}/05</span>
            <span>{currentMsg.time}</span>
          </div>
          <div className="font-pixel-body text-[13px] leading-tight mt-0.5 truncate">
            FROM: {currentMsg.from}
          </div>
          <div className="font-pixel-display text-[8px] leading-tight truncate opacity-85">
            {currentMsg.subject}
          </div>
        </div>

        <div
          onClick={() => {
            if (!isDone) finishNow();
          }}
          className="flex-1 overflow-y-auto lcd-scroll py-1.5 pr-1 cursor-pointer"
        >
          <p className="font-pixel-body text-[16px] leading-[1.16]">
            {typedText}
            {!isDone && (
              <span className="inline-block w-1.5 h-3 bg-[#1A2417] align-middle ml-0.5 animate-pixel-blink" />
            )}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
          <button
            type="button"
            onClick={() => {
              const prev = Math.max(0, selectedIndex - 1);
              onOpenMessage(prev);
            }}
            disabled={selectedIndex === 0}
            className="disabled:opacity-35 hover:underline cursor-pointer"
          >
            &lt; PREV
          </button>
          <button
            type="button"
            onClick={() => {
              const next = Math.min(INBOX_MESSAGES.length - 1, selectedIndex + 1);
              onOpenMessage(next);
            }}
            disabled={selectedIndex === INBOX_MESSAGES.length - 1}
            className="disabled:opacity-35 hover:underline cursor-pointer"
          >
            NEXT &gt;
          </button>
          <button type="button" onClick={onBackToList} className="hover:underline cursor-pointer">
            BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1">
        <span className="font-pixel-display text-[9px] font-bold">YOUR INBOX</span>
        <span className="font-pixel-display text-[8px]">{INBOX_MESSAGES.length} SMS</span>
      </div>

      <div className="flex-1 overflow-y-auto lcd-scroll my-1 space-y-0.5 pr-0.5">
        {INBOX_MESSAGES.map((msg, idx) => {
          const isSelected = idx === selectedIndex;
          const isRead = readIds.includes(msg.id);
          return (
            <button
              key={msg.id}
              type="button"
              onClick={() => {
                onSelectIndex(idx);
                onOpenMessage(idx);
              }}
              className={`w-full flex items-center gap-1.5 px-1.5 py-1 text-left cursor-pointer ${
                isSelected
                  ? 'bg-[#1A2417] text-[#97AD88]'
                  : 'text-[#1A2417] hover:bg-[#1A2417]/10'
              }`}
            >
              <PixelEnvelope open={isRead} className="w-3 h-2.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-pixel-display text-[8px] leading-tight truncate">
                  {msg.number}. {msg.subject}
                </div>
                <div className="font-pixel-body text-[12px] leading-none opacity-80 truncate">
                  FROM: {msg.from}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 font-pixel-display text-[8px]">
        <button
          type="button"
          onClick={() => onOpenMessage(selectedIndex)}
          className="hover:underline cursor-pointer"
        >
          READ
        </button>
        <button type="button" onClick={onBackToMenu} className="hover:underline cursor-pointer">
          BACK
        </button>
      </div>
    </div>
  );
};
