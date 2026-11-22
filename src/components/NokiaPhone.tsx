import React from 'react';
import { KeypadKey, PhonePowerState } from '../types';
import { PixelMusicNote } from './PixelIcons';

interface NokiaPhoneProps {
  powerState: PhonePowerState;
  isVibrating: boolean;
  isMusicPlaying: boolean;
  pressedKey: KeypadKey | null;
  onPressKey: (key: KeypadKey) => void;
  children: React.ReactNode;
}

interface NumberKeyDef {
  key: KeypadKey;
  sub: string;
  col: 0 | 1 | 2;
}

const NUMBER_KEYS: NumberKeyDef[] = [
  { key: '1', sub: 'oo', col: 0 },
  { key: '2', sub: 'abc', col: 1 },
  { key: '3', sub: 'def', col: 2 },
  { key: '4', sub: 'ghi', col: 0 },
  { key: '5', sub: 'jkl', col: 1 },
  { key: '6', sub: 'mno', col: 2 },
  { key: '7', sub: 'pqrs', col: 0 },
  { key: '8', sub: 'tuv', col: 1 },
  { key: '9', sub: 'wxyz', col: 2 },
  { key: '*', sub: '+', col: 0 },
  { key: '0', sub: '␣', col: 1 },
  { key: '#', sub: '♪', col: 2 },
];

export const NokiaPhone: React.FC<NokiaPhoneProps> = ({
  powerState,
  isVibrating,
  isMusicPlaying,
  pressedKey,
  onPressKey,
  children,
}) => {
  const isLit = powerState === 'booting' || powerState === 'on';

  return (
    <div
      className={`relative select-none transition-transform duration-300 ${
        isVibrating ? 'animate-phone-vibrate' : ''
      }`}
    >
      {/* Soft contact shadow on studio surface */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[72%] h-6 rounded-full bg-[#272623]/20 blur-md pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle glassy reflection below phone (matching reference photography) */}
      <div
        className="pointer-events-none absolute -bottom-[72px] left-1/2 -translate-x-1/2 w-[260px] h-[68px] rounded-t-[64px] opacity-25 overflow-hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(215,220,218,0.65), rgba(247,245,240,0) 85%)',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
        }}
        aria-hidden="true"
      >
        <div className="mx-auto mt-3 grid grid-cols-3 gap-3 px-6 opacity-50">
          <div className="h-7 rounded-full border border-white/80" />
          <div className="h-7 rounded-full border border-white/80 translate-y-1" />
          <div className="h-7 rounded-full border border-white/80" />
        </div>
      </div>

      {/* Outer Crystal Transparent Nokia 3310 Shell */}
      <div
        className="relative w-[314px] sm:w-[334px] rounded-t-[82px] rounded-b-[76px] p-[9px] border-[1.5px] border-white/95 shadow-[0_28px_56px_-14px_rgba(39,38,35,0.22),0_10px_22px_-8px_rgba(39,38,35,0.12),inset_0_2px_6px_rgba(255,255,255,0.98),inset_0_-4px_10px_rgba(130,138,134,0.28)]"
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(235,239,237,0.62) 45%, rgba(210,216,213,0.68) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Inner Refracted Acrylic Bevel Ring */}
        <div className="relative rounded-t-[73px] rounded-b-[67px] border border-[#B5BDB8]/65 bg-gradient-to-b from-white/70 via-[#EFF2F0]/45 to-[#DCE1DE]/60 px-4 pt-4 pb-6 shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-2px_8px_rgba(120,128,124,0.2)] overflow-hidden">
          {/* Subtle internal polycarbonate edge highlights */}
          <div
            className="pointer-events-none absolute inset-y-6 left-1.5 w-1.5 rounded-full bg-gradient-to-b from-white/80 via-white/30 to-white/70"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-6 right-1.5 w-1.5 rounded-full bg-gradient-to-b from-white/75 via-white/25 to-white/65"
            aria-hidden="true"
          />

          {/* Top Vertical 5-Hole Earpiece Stack (matching reference) */}
          <div className="relative z-10 flex flex-col items-center gap-[5px] mb-2.5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <span
                key={idx}
                className="w-[4.5px] h-[6.5px] rounded-full bg-gradient-to-b from-[#555B57] to-[#8C938E] border border-white/70 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.65)]"
              />
            ))}
          </div>

          {/* Arched Upper Forehead Panel + Embossed Clear NOKIA Logo */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-2 px-5 py-0.5 rounded-full">
              <span
                className="font-sans text-[15px] font-bold tracking-[0.26em] text-[#A2AAA5] uppercase"
                style={{
                  textShadow:
                    '0 1px 0 rgba(255,255,255,0.95), 0 -0.5px 0 rgba(70,76,72,0.35)',
                }}
              >
                NOKIA
              </span>
            </div>

            {/* Curved Clear Bezel Surrounding Monochrome LCD */}
            <div className="w-full rounded-t-[26px] rounded-b-[32px] p-[8px] bg-gradient-to-b from-[#DFE4E1]/90 via-[#C7CECA]/85 to-[#B6BEB9]/90 border border-white/85 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),0_4px_12px_rgba(39,38,35,0.12)]">
              <div className="rounded-t-[18px] rounded-b-[24px] p-[4px] bg-[#6D786F] shadow-[inset_0_3px_8px_rgba(0,0,0,0.42)]">
                {/* Sage-Green Monochrome LCD Screen */}
                <div
                  className={`relative w-full h-[206px] rounded-t-[14px] rounded-b-[20px] overflow-hidden transition-all duration-700 ${
                    isLit
                      ? 'bg-[#A1B6A3] shadow-[inset_0_0_20px_rgba(36,56,38,0.18),0_0_12px_rgba(161,182,163,0.32)]'
                      : 'bg-[#566157] shadow-[inset_0_2px_12px_rgba(0,0,0,0.45)]'
                  }`}
                >
                  {/* Subtle LCD Matrix Scanlines */}
                  <div className="pointer-events-none absolute inset-0 lcd-matrix z-20" />

                  {/* Diagonal Glass Specular Reflection */}
                  <div
                    className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-55"
                    aria-hidden="true"
                  />

                  {/* LCD Content with Left/Right Nokia 3310 Vertical Bar Scales */}
                  <div className="relative z-10 w-full h-full flex">
                    {/* Left Vertical Signal Scale (T | | | | T) */}
                    {powerState === 'on' && (
                      <div
                        className="w-[14px] h-full flex flex-col items-center justify-between py-2.5 text-[#1A2417]/80 font-pixel-display text-[8px] leading-none border-r border-[#1A2417]/10 shrink-0"
                        aria-hidden="true"
                      >
                        <span>T</span>
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span>T</span>
                      </div>
                    )}

                    {/* Center Active Screen */}
                    <div className="flex-1 min-w-0 h-full flex flex-col">
                      {powerState === 'on' && isMusicPlaying && (
                        <div className="flex items-center justify-end px-1.5 pt-0.5 text-[#1A2417]">
                          <PixelMusicNote className="w-2.5 h-2.5 animate-pulse" />
                        </div>
                      )}
                      <div className="flex-1 min-h-0">{children}</div>
                    </div>

                    {/* Right Vertical Battery Scale (T | | | | T) */}
                    {powerState === 'on' && (
                      <div
                        className="w-[14px] h-full flex flex-col items-center justify-between py-2.5 text-[#1A2417]/80 font-pixel-display text-[8px] leading-none border-l border-[#1A2417]/10 shrink-0"
                        aria-hidden="true"
                      >
                        <span>T</span>
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span className="w-[4px] h-[2px] bg-[#1A2417]" />
                        <span>T</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nokia 3310 Curved Clear Navigation Cluster */}
          <div className="relative z-10 mt-2.5 mb-3 flex flex-col items-center">
            {/* Top Center Wide Navi / Select Pill */}
            <button
              type="button"
              onClick={() => onPressKey('CALL')}
              aria-label="Center Select Button"
              className={`w-[86px] h-[22px] rounded-full border border-white/90 flex items-center justify-center transition-all duration-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] ${
                pressedKey === 'CALL'
                  ? 'translate-y-[1.5px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]'
                  : 'shadow-[0_4px_8px_rgba(39,38,35,0.14),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:brightness-105'
              }`}
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(214,220,217,0.75) 100%)',
              }}
            >
              <span className="w-6 h-[3px] rounded-full bg-[#6B736E]/75" />
            </button>

            {/* Curved Wing Cluster: Left Green/Select Wing · Center ▲▼ Rocker · Right Red/Back Wing */}
            <div className="mt-1.5 w-full flex items-start justify-between px-2 gap-1.5">
              {/* Left Curved Wing (Green Call / Select) */}
              <button
                type="button"
                onClick={() => onPressKey('CALL')}
                aria-label="Green Select / Call Button"
                className={`w-[78px] h-[34px] -rotate-[12deg] rounded-tl-[16px] rounded-tr-[24px] rounded-bl-[26px] rounded-br-[14px] border border-white/90 flex items-center justify-center gap-1 transition-all duration-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] ${
                  pressedKey === 'CALL'
                    ? 'translate-y-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]'
                    : 'shadow-[0_4px_9px_rgba(39,38,35,0.14),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:brightness-105'
                }`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(246,251,246,0.92) 0%, rgba(206,222,208,0.78) 100%)',
                }}
              >
                <span className="text-[11px] font-bold text-[#3D7A4E] rotate-[12deg]">(</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D8B52]/75" />
              </button>

              {/* Center Curved Up / Down / Left / Right Navigation Crescent */}
              <div
                className="relative w-[104px] h-[44px] mt-1 rounded-t-[16px] rounded-b-[32px] border border-white/90 shadow-[0_5px_10px_rgba(39,38,35,0.14),inset_0_1.5px_2px_rgba(255,255,255,0.95)] flex flex-col items-center justify-between py-0.5 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(212,218,215,0.74) 100%)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onPressKey('UP')}
                  aria-label="Navigate Up"
                  className={`w-full h-[20px] flex items-center justify-center text-[9px] cursor-pointer focus:outline-none ${
                    pressedKey === 'UP'
                      ? 'bg-[#1A2417]/10 text-[#1A2417]'
                      : 'text-[#555C57] hover:text-[#1A2417]'
                  }`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => onPressKey('DOWN')}
                  aria-label="Navigate Down"
                  className={`w-full h-[20px] flex items-center justify-center text-[9px] border-t border-white/60 cursor-pointer focus:outline-none ${
                    pressedKey === 'DOWN'
                      ? 'bg-[#1A2417]/10 text-[#1A2417]'
                      : 'text-[#555C57] hover:text-[#1A2417]'
                  }`}
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => onPressKey('LEFT')}
                  aria-label="Navigate Left"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-7 flex items-center justify-center text-[8px] text-[#5E6560] hover:text-[#1A2417] cursor-pointer focus:outline-none"
                >
                  ◄
                </button>
                <button
                  type="button"
                  onClick={() => onPressKey('RIGHT')}
                  aria-label="Navigate Right"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-7 flex items-center justify-center text-[8px] text-[#5E6560] hover:text-[#1A2417] cursor-pointer focus:outline-none"
                >
                  ►
                </button>
              </div>

              {/* Right Curved Wing (Red End / Back) */}
              <button
                type="button"
                onClick={() => onPressKey('END')}
                aria-label="Red Back / End Call Button"
                className={`w-[78px] h-[34px] rotate-[12deg] rounded-tl-[24px] rounded-tr-[16px] rounded-bl-[14px] rounded-br-[26px] border border-white/90 flex items-center justify-center gap-1 transition-all duration-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] ${
                  pressedKey === 'END'
                    ? 'translate-y-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)]'
                    : 'shadow-[0_4px_9px_rgba(39,38,35,0.14),inset_0_1.5px_2px_rgba(255,255,255,0.95)] hover:brightness-105'
                }`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(252,245,243,0.92) 0%, rgba(226,204,199,0.78) 100%)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9523E]/75" />
                <span className="text-[11px] font-bold text-[#B24735] -rotate-[12deg]">)</span>
              </button>
            </div>
          </div>

          {/* Classic Nokia 3310 Smile-Arc Clear Oval Keypad */}
          <div className="relative z-10 grid grid-cols-3 gap-x-2.5 gap-y-3 px-2 pt-1">
            {NUMBER_KEYS.map((item) => {
              const isDown = pressedKey === item.key;
              const arcTransform =
                item.col === 0
                  ? '-translate-y-[3px] rotate-[7deg]'
                  : item.col === 2
                  ? '-translate-y-[3px] -rotate-[7deg]'
                  : 'translate-y-[4px]';

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onPressKey(item.key)}
                  aria-label={`Key ${item.key} ${item.sub}`}
                  className={`group relative h-[38px] rounded-[999px] border-[1.5px] border-white/90 p-[2px] transition-all duration-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DF7442] ${arcTransform} ${
                    isDown
                      ? 'translate-y-[5px] shadow-[inset_0_2px_5px_rgba(0,0,0,0.25)]'
                      : 'shadow-[0_5px_10px_rgba(39,38,35,0.14),inset_0_2px_3px_rgba(255,255,255,0.98)] hover:brightness-[1.03] active:translate-y-[5px]'
                  }`}
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(214,220,217,0.72) 100%)',
                  }}
                >
                  {/* Inner clear crystal lens bevel */}
                  <div className="w-full h-full rounded-[999px] border border-[#AEB7B1]/55 bg-gradient-to-b from-white/75 to-[#D9DFDC]/65 flex items-center justify-center gap-1 px-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]">
                    <span className="font-sans text-[14px] font-medium text-[#343A36] leading-none">
                      {item.key}
                    </span>
                    <span className="font-sans text-[9.5px] tracking-tight text-[#5E6560] leading-none">
                      {item.sub}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Microphone Aperture */}
          <div className="relative z-10 mt-5 flex justify-center">
            <div className="w-6 h-1 rounded-full bg-[#929994]/65 shadow-[inset_0_1px_1.5px_rgba(0,0,0,0.4)]" />
          </div>
        </div>
      </div>
    </div>
  );
};
