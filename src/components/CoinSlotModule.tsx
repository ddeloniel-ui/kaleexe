import React, { useRef, useState } from 'react';
import { Heart } from 'lucide-react';

interface CoinSlotModuleProps {
  onInsertCoin: () => void;
  disabled?: boolean;
  isInserting?: boolean;
}

export const CoinSlotModule: React.FC<CoinSlotModuleProps> = ({
  onInsertCoin,
  disabled = false,
  isInserting = false,
}) => {
  const slotRef = useRef<HTMLDivElement | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isOverSlot, setIsOverSlot] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number } | null>(null);
  const movedRef = useRef(false);

  const checkSlotOverlap = (clientX: number, clientY: number): boolean => {
    if (!slotRef.current) return false;
    const rect = slotRef.current.getBoundingClientRect();
    const pad = 26;
    return (
      clientX >= rect.left - pad &&
      clientX <= rect.right + pad &&
      clientY >= rect.top - pad &&
      clientY <= rect.bottom + pad
    );
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isInserting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { startX: e.clientX, startY: e.clientY };
    movedRef.current = false;
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStartRef.current || disabled || isInserting) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.hypot(dx, dy) > 6) {
      movedRef.current = true;
    }
    setDragOffset({ x: dx, y: dy });
    setIsOverSlot(checkSlotOverlap(e.clientX, e.clientY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStartRef.current) return;
    const droppedOnSlot = checkSlotOverlap(e.clientX, e.clientY);
    const wasClick = !movedRef.current;

    dragStartRef.current = null;
    setDragOffset(null);
    setIsOverSlot(false);

    if ((droppedOnSlot || wasClick) && !disabled && !isInserting) {
      onInsertCoin();
    }
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
    setDragOffset(null);
    setIsOverSlot(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Brushed metallic coin slot housing */}
      <div
        ref={slotRef}
        className={`relative flex flex-col items-center px-6 py-5 rounded-2xl border transition-all duration-200 ${
          isOverSlot
            ? 'bg-[#EAE6DC] border-[#DF7442] shadow-[0_10px_28px_rgba(223,116,66,0.22)] scale-[1.03]'
            : 'bg-[#EFECE4]/90 border-[#D8D3C6] shadow-[0_8px_24px_rgba(39,38,35,0.06),inset_0_1px_0_rgba(255,255,255,0.85)]'
        }`}
      >
        <span className="font-mono-label text-[10px] tracking-[0.2em] text-[#6F6C64] uppercase mb-3">
          Coin Acceptor
        </span>

        {/* Recessed steel bezel + vertical slot */}
        <div className="relative w-16 h-20 rounded-xl bg-gradient-to-b from-[#D7D4CA] via-[#E5E2D9] to-[#C8C4B9] p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.12)] flex items-center justify-center">
          <div className="w-full h-full rounded-lg bg-gradient-to-b from-[#C0BDB3] to-[#D9D6CD] border border-[#ABA79B] flex items-center justify-center relative overflow-hidden">
            {/* The dark slot opening */}
            <div
              className={`w-2.5 h-12 rounded-full bg-[#1C1B19] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.5)] transition-all duration-200 ${
                isOverSlot ? 'ring-2 ring-[#DF7442]/60' : ''
              }`}
            />
            {/* Coin drop animation inside slot */}
            {isInserting && (
              <div className="absolute inset-0 flex items-start justify-center pt-1 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7DF8D] via-[#DDA843] to-[#9E6E1E] border border-[#8A5F16] shadow-md flex items-center justify-center animate-coin-drop">
                  <Heart className="w-4 h-4 text-[#6B460B] fill-[#6B460B]" />
                </div>
              </div>
            )}
          </div>
          {/* Small orange indicator LED */}
          <span
            className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              isInserting || isOverSlot
                ? 'bg-[#DF7442] shadow-[0_0_6px_#DF7442]'
                : 'bg-[#B2AEA2]'
            }`}
          />
        </div>

        <span className="mt-2.5 font-mono-label text-[10px] tracking-[0.12em] text-[#7D796F]">
          {isOverSlot ? 'RELEASE TO INSERT' : 'DROP COIN HERE'}
        </span>
      </div>

      {/* Draggable golden token */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="h-24 flex items-center justify-center">
          {!isInserting && (
            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              aria-label="Golden token coin — drag into coin slot or click to insert"
              style={
                dragOffset
                  ? {
                      transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(1.06)`,
                      zIndex: 40,
                      cursor: 'grabbing',
                    }
                  : undefined
              }
              className={`group relative w-20 h-20 rounded-full touch-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F5F0] ${
                dragOffset
                  ? 'transition-none shadow-[0_18px_32px_rgba(122,86,21,0.32)]'
                  : 'animate-coin-float cursor-grab hover:scale-105 transition-transform duration-200 shadow-[0_10px_22px_rgba(130,92,26,0.24)]'
              }`}
            >
              {/* Outer milled gold rim */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FBE9A6] via-[#D9A23D] to-[#986819] p-[5px] border border-[#B07E23]">
                {/* Inner recessed coin face */}
                <div className="w-full h-full rounded-full bg-gradient-to-tl from-[#C9912E] via-[#F2D27A] to-[#DFAB47] border border-[#9E701D]/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_5px_rgba(110,72,12,0.4)] flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Subtle metallic specular streak */}
                  <div className="absolute -inset-2 bg-gradient-to-tr from-transparent via-white/35 to-transparent rotate-12 pointer-events-none" />
                  <Heart className="w-5 h-5 text-[#754D0D] fill-[#754D0D]/80 mb-0.5 drop-shadow-[0_1px_0_rgba(255,244,200,0.65)]" />
                  <span className="font-mono-label text-[9px] font-medium tracking-[0.18em] text-[#69440A]">
                    002
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Clickable alternative CTA */}
        <button
          type="button"
          onClick={onInsertCoin}
          disabled={disabled || isInserting}
          className="px-5 py-2.5 rounded-full bg-[#272623] text-[#F7F5F0] hover:bg-[#3A3833] active:scale-[0.98] disabled:opacity-50 transition-all duration-150 font-mono-label text-xs tracking-[0.14em] uppercase shadow-[0_6px_16px_rgba(39,38,35,0.16)] flex items-center gap-2 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F5F0]"
        >
          <span>{isInserting ? 'INSERTING COIN...' : 'INSERT ONE COIN'}</span>
          <span className="text-[#DF7442]" aria-hidden="true">♥</span>
        </button>

        <p className="text-xs text-[#6F6C64] text-center max-w-[210px] leading-relaxed">
          Drag the coin into the slot or press the button to power on
        </p>
      </div>
    </div>
  );
};
