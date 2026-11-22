import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from './audio/soundEngine';
import { CoinSlotModule } from './components/CoinSlotModule';
import { NokiaPhone } from './components/NokiaPhone';
import { FinalScreen } from './components/screens/FinalScreen';
import { InboxScreen } from './components/screens/InboxScreen';
import { LetterScreen } from './components/screens/LetterScreen';
import { MAIN_MENU_ITEMS, MainMenuScreen } from './components/screens/MainMenuScreen';
import { MusicPlayerScreen } from './components/screens/MusicPlayerScreen';
import { RemindersScreen } from './components/screens/RemindersScreen';
import { SecretScreen } from './components/screens/SecretScreen';
import { SelfLoveScreen } from './components/screens/SelfLoveScreen';
import { StartupScreen } from './components/screens/StartupScreen';
import {
  DEFAULT_PLAYLIST,
  INBOX_MESSAGES,
  REMINDERS,
  SELF_LOVE_MENU_ITEMS,
  WORTH_AFFIRMATIONS,
} from './data/content';
import { KeypadKey, PhonePowerState, PlaylistTrack, ScreenRoute } from './types';

export default function App() {
  const [powerState, setPowerState] = useState<PhonePowerState>('off');
  const [isInsertingCoin, setIsInsertingCoin] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [route, setRoute] = useState<ScreenRoute>('menu');

  // Navigation & content indices
  const [mainMenuIndex, setMainMenuIndex] = useState(0);
  const [reminderIndex, setReminderIndex] = useState(0);
  const [inboxIndex, setInboxIndex] = useState(0);
  const [readSmsIds, setReadSmsIds] = useState<string[]>([]);
  const [selfLoveIndex, setSelfLoveIndex] = useState(0);
  const [worthIndex, setWorthIndex] = useState(0);

  // Secret unlock (enter 1234 on Secret screen)
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [justUnlockedSecret, setJustUnlockedSecret] = useState(false);

  // Scroll signal for long LCD screens (Letter, Secret, Final)
  const [scrollSignal, setScrollSignal] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  // Audio & Music Player state
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>(DEFAULT_PLAYLIST);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);

  // Physical button visual press feedback
  const [pressedKey, setPressedKey] = useState<KeypadKey | null>(null);
  const keyFeedbackTimerRef = useRef<number | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopTrack();
    };
  }, []);

  const triggerScroll = useCallback((dir: 'up' | 'down') => {
    setScrollDirection(dir);
    setScrollSignal((s) => s + 1);
  }, []);

  const handleInsertCoin = useCallback(() => {
    if (powerState !== 'off' || isInsertingCoin) return;
    setIsInsertingCoin(true);
    soundEngine.playCoinSound();

    // Vibrate phone & start boot sequence after coin drops into slot
    window.setTimeout(() => {
      setIsVibrating(true);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([45, 30, 65]);
        } catch {
          // ignore
        }
      }
      setPowerState('booting');
      soundEngine.playStartupChime();

      window.setTimeout(() => {
        setIsVibrating(false);
        setIsInsertingCoin(false);
      }, 650);
    }, 680);
  }, [powerState, isInsertingCoin]);

  const handleTurnOff = useCallback(() => {
    soundEngine.stopTrack();
    setIsMusicPlaying(false);
    setPowerState('off');
    setRoute('menu');
    setMainMenuIndex(0);
    setPinInput('');
    setPinError(false);
  }, []);

  const handleRestartPhone = useCallback(() => {
    soundEngine.stopTrack();
    setIsMusicPlaying(false);
    setPowerState('booting');
    setRoute('menu');
    setMainMenuIndex(0);
    setPinInput('');
    setPinError(false);
    soundEngine.playStartupChime();
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  const handlePlayTrackAt = useCallback(
    (idx: number, shouldPlay = true) => {
      const safeIdx = ((idx % playlist.length) + playlist.length) % playlist.length;
      setTrackIndex(safeIdx);
      if (shouldPlay) {
        soundEngine.startTrack(playlist[safeIdx]);
        setIsMusicPlaying(true);
      }
    },
    [playlist]
  );

  const handlePlayPause = useCallback(() => {
    if (isMusicPlaying) {
      soundEngine.stopTrack();
      setIsMusicPlaying(false);
    } else {
      soundEngine.startTrack(playlist[trackIndex]);
      setIsMusicPlaying(true);
    }
  }, [isMusicPlaying, playlist, trackIndex]);

  const handleStopMusic = useCallback(() => {
    soundEngine.stopTrack();
    setIsMusicPlaying(false);
  }, []);

  const handleChangeVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolume(clamped);
    soundEngine.setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
  }, [isMuted]);

  const handleAddCustomTrack = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').toUpperCase().slice(0, 22);
      const newTrack: PlaylistTrack = {
        id: `custom-${Date.now()}`,
        title: cleanName || 'CUSTOM TRACK',
        artist: 'YOUR FILE',
        genre: 'Custom Audio',
        durationSeconds: 180,
        bpm: 70,
        chords: DEFAULT_PLAYLIST[0].chords,
        melody: DEFAULT_PLAYLIST[0].melody,
        customUrl: url,
      };
      setPlaylist((prev) => {
        const next = [...prev, newTrack];
        const newIdx = next.length - 1;
        setTrackIndex(newIdx);
        soundEngine.startTrack(newTrack);
        setIsMusicPlaying(true);
        return next;
      });
    },
    []
  );

  const openInboxMessage = useCallback((idx: number) => {
    const safeIdx = Math.max(0, Math.min(INBOX_MESSAGES.length - 1, idx));
    setInboxIndex(safeIdx);
    const msgId = INBOX_MESSAGES[safeIdx].id;
    setReadSmsIds((prev) => (prev.includes(msgId) ? prev : [...prev, msgId]));
    setRoute('inbox_detail');
  }, []);

  const handleKeypadPress = useCallback(
    (key: KeypadKey) => {
      // Visual button press animation
      setPressedKey(key);
      if (keyFeedbackTimerRef.current) {
        window.clearTimeout(keyFeedbackTimerRef.current);
      }
      keyFeedbackTimerRef.current = window.setTimeout(() => {
        setPressedKey(null);
      }, 150);

      // If phone is off, pressing CALL/Green gently reminds or nudges coin; no sound until coin inserted
      if (powerState === 'off') {
        return;
      }

      soundEngine.playKeyTone(key);

      if (powerState === 'booting') {
        if (key === 'CALL' || key === 'END') {
          setPowerState('on');
          setRoute('menu');
        }
        return;
      }

      // Global # key toggles mute
      if (key === '#') {
        handleToggleMute();
        return;
      }

      // Route-specific navigation
      if (route === 'menu') {
        if (key === 'UP') {
          setMainMenuIndex((i) => (i - 1 + MAIN_MENU_ITEMS.length) % MAIN_MENU_ITEMS.length);
        } else if (key === 'DOWN') {
          setMainMenuIndex((i) => (i + 1) % MAIN_MENU_ITEMS.length);
        } else if (key === 'CALL') {
          setRoute(MAIN_MENU_ITEMS[mainMenuIndex].route);
        } else if (key === 'END') {
          setRoute('final');
        } else if (key >= '1' && key <= '6') {
          const idx = Number(key) - 1;
          setMainMenuIndex(idx);
          setRoute(MAIN_MENU_ITEMS[idx].route);
        } else if (key === '0') {
          setRoute('final');
        }
        return;
      }

      if (route === 'reminders') {
        if (key === 'LEFT' || key === 'UP') {
          setReminderIndex((i) => Math.max(0, i - 1));
        } else if (key === 'RIGHT' || key === 'DOWN') {
          setReminderIndex((i) => Math.min(REMINDERS.length - 1, i + 1));
        } else if (key === 'CALL') {
          if (reminderIndex < REMINDERS.length - 1) {
            setReminderIndex((i) => i + 1);
          } else {
            setRoute('final');
          }
        } else if (key === 'END') {
          setRoute('menu');
        } else if (key === '7') {
          setReminderIndex((i) => Math.max(0, i - 5));
        } else if (key === '9') {
          setReminderIndex((i) => Math.min(REMINDERS.length - 1, i + 5));
        } else if (key === '0') {
          setReminderIndex(0);
        }
        return;
      }

      if (route === 'inbox') {
        if (key === 'UP') {
          setInboxIndex((i) => (i - 1 + INBOX_MESSAGES.length) % INBOX_MESSAGES.length);
        } else if (key === 'DOWN') {
          setInboxIndex((i) => (i + 1) % INBOX_MESSAGES.length);
        } else if (key === 'CALL' || key === 'RIGHT') {
          openInboxMessage(inboxIndex);
        } else if (key === 'END' || key === 'LEFT') {
          setRoute('menu');
        } else if (key >= '1' && key <= '5') {
          openInboxMessage(Number(key) - 1);
        }
        return;
      }

      if (route === 'inbox_detail') {
        if (key === 'LEFT' || key === 'UP') {
          openInboxMessage(Math.max(0, inboxIndex - 1));
        } else if (key === 'RIGHT' || key === 'DOWN' || key === 'CALL') {
          if (inboxIndex < INBOX_MESSAGES.length - 1) {
            openInboxMessage(inboxIndex + 1);
          }
        } else if (key === 'END') {
          setRoute('inbox');
        }
        return;
      }

      if (route === 'self_love') {
        const subRoutes: ScreenRoute[] = [
          'self_love_breath',
          'self_love_song',
          'self_love_three_things',
          'self_love_break',
          'self_love_worth',
        ];
        if (key === 'UP') {
          setSelfLoveIndex((i) => (i - 1 + SELF_LOVE_MENU_ITEMS.length) % SELF_LOVE_MENU_ITEMS.length);
        } else if (key === 'DOWN') {
          setSelfLoveIndex((i) => (i + 1) % SELF_LOVE_MENU_ITEMS.length);
        } else if (key === 'CALL') {
          setRoute(subRoutes[selfLoveIndex]);
        } else if (key === 'END') {
          setRoute('menu');
        } else if (key >= '1' && key <= '5') {
          const idx = Number(key) - 1;
          setSelfLoveIndex(idx);
          setRoute(subRoutes[idx]);
        }
        return;
      }

      if (
        route === 'self_love_breath' ||
        route === 'self_love_song' ||
        route === 'self_love_three_things' ||
        route === 'self_love_break' ||
        route === 'self_love_worth'
      ) {
        if (key === 'END') {
          setRoute('self_love');
          return;
        }
        if (route === 'self_love_worth') {
          if (key === 'LEFT' || key === 'UP') {
            setWorthIndex((i) => (i - 1 + WORTH_AFFIRMATIONS.length) % WORTH_AFFIRMATIONS.length);
          } else if (key === 'RIGHT' || key === 'DOWN' || key === 'CALL') {
            setWorthIndex((i) => (i + 1) % WORTH_AFFIRMATIONS.length);
          }
        } else if (route === 'self_love_song') {
          if (key === 'CALL') handlePlayPause();
          if (key === 'RIGHT') handlePlayTrackAt(trackIndex + 1, true);
          if (key === 'LEFT') handlePlayTrackAt(trackIndex - 1, true);
        }
        return;
      }

      if (route === 'letter') {
        if (key === 'UP') triggerScroll('up');
        else if (key === 'DOWN') triggerScroll('down');
        else if (key === 'END') setRoute('menu');
        else if (key === 'CALL') setRoute('final');
        return;
      }

      if (route === 'secret') {
        if (!secretUnlocked) {
          if (key >= '0' && key <= '9') {
            setPinError(false);
            setPinInput((prev) => {
              if (prev.length >= 4) return prev;
              const next = prev + key;
              if (next.length === 4) {
                if (next === '1234') {
                  setSecretUnlocked(true);
                  setJustUnlockedSecret(true);
                  soundEngine.playSecretUnlockChime();
                  window.setTimeout(() => setJustUnlockedSecret(false), 750);
                  return '';
                } else {
                  setPinError(true);
                  window.setTimeout(() => {
                    setPinInput('');
                  }, 650);
                }
              }
              return next;
            });
          } else if (key === 'END') {
            if (pinInput.length > 0) {
              setPinInput((p) => p.slice(0, -1));
              setPinError(false);
            } else {
              setRoute('menu');
            }
          } else if (key === 'CALL') {
            setPinInput('');
            setPinError(false);
          }
          return;
        }

        if (key === 'UP') triggerScroll('up');
        else if (key === 'DOWN') triggerScroll('down');
        else if (key === 'END') setRoute('menu');
        else if (key === 'CALL') setRoute('final');
        return;
      }

      if (route === 'music') {
        if (key === 'CALL' || key === '8') {
          handlePlayPause();
        } else if (key === 'LEFT' || key === '7') {
          handlePlayTrackAt(trackIndex - 1, true);
        } else if (key === 'RIGHT' || key === '9') {
          handlePlayTrackAt(trackIndex + 1, true);
        } else if (key === 'UP') {
          handleChangeVolume(volume + 0.1);
        } else if (key === 'DOWN') {
          handleChangeVolume(volume - 0.1);
        } else if (key === '0') {
          handleStopMusic();
        } else if (key === 'END') {
          setRoute('menu');
        }
        return;
      }

      if (route === 'final') {
        if (key === 'UP') triggerScroll('up');
        else if (key === 'DOWN') triggerScroll('down');
        else if (key === 'CALL') setRoute('menu');
        else if (key === 'END') handleTurnOff();
      }
    },
    [
      powerState,
      route,
      mainMenuIndex,
      reminderIndex,
      inboxIndex,
      selfLoveIndex,
      secretUnlocked,
      pinInput,
      trackIndex,
      volume,
      handleToggleMute,
      handlePlayPause,
      handlePlayTrackAt,
      handleChangeVolume,
      handleStopMusic,
      handleTurnOff,
      openInboxMessage,
      triggerScroll,
    ]
  );

  // Physical keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (isInput && e.key !== 'Escape') {
        return;
      }

      const keyMap: Record<string, KeypadKey> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        Enter: 'CALL',
        Escape: 'END',
        Backspace: 'END',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '0',
        '*': '*',
        '#': '#',
      };

      const mapped = keyMap[e.key];
      if (mapped) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
        }
        handleKeypadPress(mapped);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeypadPress]);

  const unreadCount = INBOX_MESSAGES.length - readSmsIds.length;

  const renderLcdContent = () => {
    if (powerState === 'off') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none opacity-45">
          <div className="font-pixel-display text-[10px] tracking-[0.22em] text-[#1A2417]">
            POWER OFF
          </div>
          <div className="font-pixel-body text-[14px] text-[#1A2417] mt-1">
            Insert coin to begin
          </div>
        </div>
      );
    }

    if (powerState === 'booting') {
      return (
        <StartupScreen
          onComplete={() => {
            setPowerState('on');
            setRoute('menu');
          }}
        />
      );
    }

    switch (route) {
      case 'menu':
        return (
          <MainMenuScreen
            selectedIndex={mainMenuIndex}
            onSelectIndex={setMainMenuIndex}
            onOpenRoute={(r) => setRoute(r)}
            secretUnlocked={secretUnlocked}
            starPressCount={0}
            unreadCount={unreadCount}
            isMusicPlaying={isMusicPlaying}
            onGoToFinal={() => setRoute('final')}
          />
        );
      case 'reminders':
        return (
          <RemindersScreen
            index={reminderIndex}
            onPrev={() => setReminderIndex((i) => Math.max(0, i - 1))}
            onNext={() => setReminderIndex((i) => Math.min(REMINDERS.length - 1, i + 1))}
            onBack={() => setRoute('menu')}
            onGoToFinal={() => setRoute('final')}
          />
        );
      case 'inbox':
      case 'inbox_detail':
        return (
          <InboxScreen
            mode={route === 'inbox_detail' ? 'detail' : 'list'}
            selectedIndex={inboxIndex}
            readIds={readSmsIds}
            onSelectIndex={setInboxIndex}
            onOpenMessage={openInboxMessage}
            onBackToList={() => setRoute('inbox')}
            onBackToMenu={() => setRoute('menu')}
          />
        );
      case 'self_love':
      case 'self_love_breath':
      case 'self_love_song':
      case 'self_love_three_things':
      case 'self_love_break':
      case 'self_love_worth':
        return (
          <SelfLoveScreen
            route={route}
            menuIndex={selfLoveIndex}
            onSelectMenuIndex={setSelfLoveIndex}
            onNavigate={(r) => setRoute(r)}
            onBackToMenu={() => setRoute('menu')}
            currentTrack={playlist[trackIndex] ?? playlist[0]}
            isMusicPlaying={isMusicPlaying}
            onTogglePlay={handlePlayPause}
            onNextTrack={() => handlePlayTrackAt(trackIndex + 1, true)}
            worthIndex={worthIndex}
            onNextWorth={() => setWorthIndex((i) => (i + 1) % WORTH_AFFIRMATIONS.length)}
            onPrevWorth={() =>
              setWorthIndex(
                (i) => (i - 1 + WORTH_AFFIRMATIONS.length) % WORTH_AFFIRMATIONS.length
              )
            }
          />
        );
      case 'letter':
        return (
          <LetterScreen
            scrollSignal={scrollSignal}
            scrollDirection={scrollDirection}
            onBack={() => setRoute('menu')}
            onGoToFinal={() => setRoute('final')}
          />
        );
      case 'secret':
        return (
          <SecretScreen
            unlocked={secretUnlocked}
            justUnlocked={justUnlockedSecret}
            pinInput={pinInput}
            pinError={pinError}
            onDeletePinDigit={() => {
              setPinInput('');
              setPinError(false);
            }}
            scrollSignal={scrollSignal}
            scrollDirection={scrollDirection}
            onBack={() => {
              setPinInput('');
              setPinError(false);
              setRoute('menu');
            }}
            onGoToFinal={() => setRoute('final')}
          />
        );
      case 'music':
        return (
          <MusicPlayerScreen
            playlist={playlist}
            trackIndex={trackIndex}
            isPlaying={isMusicPlaying}
            volume={volume}
            onPlayPause={handlePlayPause}
            onStop={handleStopMusic}
            onPrev={() => handlePlayTrackAt(trackIndex - 1, true)}
            onNext={() => handlePlayTrackAt(trackIndex + 1, true)}
            onChangeVolume={handleChangeVolume}
            onAddCustomTrack={handleAddCustomTrack}
            onBack={() => setRoute('menu')}
          />
        );
      case 'final':
        return (
          <FinalScreen
            scrollSignal={scrollSignal}
            scrollDirection={scrollDirection}
            onReadAgain={() => setRoute('menu')}
            onRestartPhone={handleRestartPhone}
            onTurnOff={handleTurnOff}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7F5F0] text-[#272623] flex flex-col justify-between overflow-x-hidden">
      {/* Subtle studio film grain & soft vignette lighting */}
      <div className="pointer-events-none fixed inset-0 film-grain z-50" aria-hidden="true" />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.72) 0%, rgba(247,245,240,0) 62%), radial-gradient(circle at 85% 90%, rgba(151,173,136,0.12) 0%, transparent 45%)',
        }}
        aria-hidden="true"
      />

      {/* Minimal Top Plaque / Audio Control */}
      <header className="relative z-10 w-full max-w-[1160px] mx-auto px-6 pt-5 pb-2 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <span className="font-mono-label text-xs font-medium tracking-[0.2em] text-[#272623] uppercase whitespace-nowrap">
            KALE.exe
          </span>
          <span className="text-[#B8B3A7]" aria-hidden="true">
            ·
          </span>
          <span className="font-mono-label text-[11px] tracking-[0.16em] text-[#6F6C64] uppercase hidden sm:inline whitespace-nowrap">
            OBJECT NO. 002
          </span>
        </div>

        <div className="flex items-center gap-4">
          {powerState === 'on' && (
            <button
              type="button"
              onClick={() => setRoute('final')}
              className="font-mono-label text-[11px] tracking-[0.14em] text-[#6F6C64] hover:text-[#272623] transition-colors uppercase whitespace-nowrap cursor-pointer"
            >
              A New Chapter
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex items-center gap-1.5 font-mono-label text-[11px] tracking-[0.14em] text-[#6F6C64] hover:text-[#272623] transition-colors uppercase whitespace-nowrap cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isMuted ? 'Muted' : 'Sound'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Stage */}
      <main className="relative z-10 flex-1 w-full max-w-[1160px] mx-auto px-6 py-6 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          {/* Left Editorial Object Label (or top on mobile) */}
          <div className="w-full max-w-[300px] lg:text-left text-center flex flex-col items-center lg:items-start gap-3">
            <p className="font-mono-label text-[11px] tracking-[0.22em] text-[#6F6C64] uppercase">
              PERSONAL REMINDER DEVICE
            </p>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#272623] text-balance leading-[1.12]">
              KALE.exe
            </h1>
            <div className="flex items-center gap-2 font-mono-label text-[11px] tracking-[0.16em] text-[#6F6C64] uppercase">
              <span>OBJECT NO. 002</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#DF7442]">♥</span>
            </div>
            <p className="text-sm text-[#57544D] leading-relaxed max-w-[260px]">
              A LITTLE COLLECTION OF GOOD THOUGHTS
            </p>

            {/* Subtle keypad guide when phone is powered on */}
            {powerState === 'on' && (
              <div className="mt-4 pt-4 border-t border-[#E3DFD5] w-full space-y-2 text-left hidden lg:block">
                <p className="font-mono-label text-[10px] tracking-[0.18em] text-[#6F6C64] uppercase">
                  Device Controls
                </p>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs text-[#57544D]">
                  <span>
                    <strong className="font-medium text-[#272623]">Green</strong> · Select
                  </span>
                  <span>
                    <strong className="font-medium text-[#272623]">Red</strong> · Back
                  </span>
                  <span>
                    <strong className="font-medium text-[#272623]">▲ / ▼</strong> · Navigate
                  </span>
                  <span>
                    <strong className="font-medium text-[#272623]">1234</strong> · Secret Code
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center Hero: Transparent Vintage Nokia Phone */}
          <div className="flex flex-col items-center">
            <NokiaPhone
              powerState={powerState}
              isVibrating={isVibrating}
              isMusicPlaying={isMusicPlaying}
              pressedKey={pressedKey}
              onPressKey={handleKeypadPress}
            >
              {renderLcdContent()}
            </NokiaPhone>

            {/* Opening message below the phone */}
            <p className="mt-8 text-sm sm:text-[15px] text-[#57544D] text-center max-w-[300px] leading-relaxed">
              &ldquo;Hey Kale, I think you could use a little reminder today.&rdquo;
            </p>
          </div>

          {/* Right Side: Interactive Coin & Slot (when Off) OR Quiet Quick-Jump Index (when On) */}
          <div className="w-full max-w-[280px] flex flex-col items-center justify-center min-h-[260px]">
            {powerState === 'off' ? (
              <CoinSlotModule
                onInsertCoin={handleInsertCoin}
                disabled={powerState !== 'off'}
                isInserting={isInsertingCoin}
              />
            ) : (
              <div className="w-full flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-[#6F6C64] uppercase">
                  One chapter ending doesn&apos;t mean your story is over.
                </p>

                {powerState === 'on' && (
                  <div className="w-full pt-3 border-t border-[#E3DFD5] flex flex-col gap-2">
                    <span className="font-mono-label text-[10px] tracking-[0.16em] text-[#6F6C64] uppercase">
                      Quick Menu
                    </span>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setRoute('reminders')}
                        className={`hover:text-[#272623] transition-colors cursor-pointer ${
                          route === 'reminders'
                            ? 'text-[#DF7442] font-medium'
                            : 'text-[#6F6C64]'
                        }`}
                      >
                        25 Reminders
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoute('inbox')}
                        className={`hover:text-[#272623] transition-colors cursor-pointer ${
                          route === 'inbox' || route === 'inbox_detail'
                            ? 'text-[#DF7442] font-medium'
                            : 'text-[#6F6C64]'
                        }`}
                      >
                        Inbox
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoute('self_love')}
                        className={`hover:text-[#272623] transition-colors cursor-pointer ${
                          route.startsWith('self_love')
                            ? 'text-[#DF7442] font-medium'
                            : 'text-[#6F6C64]'
                        }`}
                      >
                        Self-Love
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoute('letter')}
                        className={`hover:text-[#272623] transition-colors cursor-pointer ${
                          route === 'letter'
                            ? 'text-[#DF7442] font-medium'
                            : 'text-[#6F6C64]'
                        }`}
                      >
                        Letter
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoute('music')}
                        className={`hover:text-[#272623] transition-colors cursor-pointer ${
                          route === 'music'
                            ? 'text-[#DF7442] font-medium'
                            : 'text-[#6F6C64]'
                        }`}
                      >
                        Music
                      </button>
                    </div>

                    <div className="pt-3 flex items-center justify-center lg:justify-start gap-4">
                      <button
                        type="button"
                        onClick={handleRestartPhone}
                        className="font-mono-label text-[10px] tracking-[0.14em] text-[#6F6C64] hover:text-[#272623] uppercase cursor-pointer"
                      >
                        Restart
                      </button>
                      <span className="text-[#D2CDC1]" aria-hidden="true">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={handleTurnOff}
                        className="font-mono-label text-[10px] tracking-[0.14em] text-[#6F6C64] hover:text-[#272623] uppercase cursor-pointer"
                      >
                        Turn Off
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="relative z-10 w-full max-w-[1160px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7D796F]">
        <span className="font-mono-label tracking-[0.12em] uppercase">
          KALE.exe — YOU DESERVE HAPPINESS, EVEN AFTER A HARD GOODBYE. ♥
        </span>
        <span className="font-mono-label tracking-[0.12em] uppercase">
          SECRET MESSAGE CODE: 1234
        </span>
      </footer>
    </div>
  );
}
