import React from 'react';
import { ScreenRoute } from '../../types';
import { PixelHeart, PixelLock, PixelMusicNote } from '../PixelIcons';

export interface MainMenuItem {
  id: string;
  num: string;
  label: string;
  route: ScreenRoute;
}

export const MAIN_MENU_ITEMS: MainMenuItem[] = [
  { id: 'reminders', num: '1', label: 'LITTLE REMINDERS', route: 'reminders' },
  { id: 'inbox', num: '2', label: 'YOUR INBOX', route: 'inbox' },
  { id: 'self_love', num: '3', label: 'SELF-LOVE MODE', route: 'self_love' },
  { id: 'letter', num: '4', label: 'A LETTER FOR YOU', route: 'letter' },
  { id: 'secret', num: '5', label: 'SECRET MESSAGE', route: 'secret' },
  { id: 'music', num: '6', label: 'MUSIC PLAYER', route: 'music' },
];

interface MainMenuScreenProps {
  selectedIndex: number;
  onSelectIndex: (idx: number) => void;
  onOpenRoute: (route: ScreenRoute) => void;
  secretUnlocked: boolean;
  starPressCount: number;
  unreadCount: number;
  isMusicPlaying: boolean;
  onGoToFinal: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  selectedIndex,
  onSelectIndex,
  onOpenRoute,
  secretUnlocked,
  starPressCount,
  unreadCount,
  isMusicPlaying,
  onGoToFinal,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-2 text-[#1A2417] select-none">
      {/* Menu Header */}
      <div className="flex items-center justify-between border-b border-[#1A2417]/30 pb-1 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="font-pixel-display text-[10px] font-bold tracking-wider">
            KALE.exe
          </span>
          {isMusicPlaying && <PixelMusicNote className="w-2.5 h-2.5 animate-pulse" />}
        </div>
        <div className="flex items-center gap-1 font-pixel-display text-[8px]">
          {starPressCount > 0 && !secretUnlocked && (
            <span className="tracking-widest" title="Press * three times">
              {'*'.repeat(starPressCount)}
            </span>
          )}
          {unreadCount > 0 && <span className="opacity-80">{unreadCount}MSG</span>}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto lcd-scroll my-1 space-y-0.5 pr-0.5">
        {MAIN_MENU_ITEMS.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectIndex(idx);
                onOpenRoute(item.route);
              }}
              className={`w-full flex items-center justify-between px-1.5 py-0.5 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#1A2417] text-[#97AD88]'
                  : 'text-[#1A2417] hover:bg-[#1A2417]/10'
              }`}
            >
              <span className="font-pixel-body text-[16px] leading-[1.1] tracking-tight truncate">
                {item.num}. {item.label}
              </span>
              {item.id === 'secret' && (
                <PixelLock unlocked={secretUnlocked} className="w-2.5 h-2.5 shrink-0 ml-1" />
              )}
              {item.id === 'reminders' && isSelected && (
                <PixelHeart className="w-2.5 h-2.5 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Classic Nokia Softkey Footer */}
      <div className="flex items-center justify-between border-t border-[#1A2417]/30 pt-1 px-0.5 font-pixel-display text-[8px]">
        <button
          type="button"
          onClick={() => onOpenRoute(MAIN_MENU_ITEMS[selectedIndex].route)}
          className="hover:underline cursor-pointer"
        >
          SELECT
        </button>
        <span className="opacity-65 font-pixel-body text-[12px]">
          {secretUnlocked ? '♥ UNLOCKED' : 'PIN: 1234'}
        </span>
        <button
          type="button"
          onClick={onGoToFinal}
          className="hover:underline cursor-pointer"
        >
          END CHPT
        </button>
      </div>
    </div>
  );
};
