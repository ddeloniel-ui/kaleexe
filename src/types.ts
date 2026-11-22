export type PhonePowerState = 'off' | 'booting' | 'on';

export type ScreenRoute =
  | 'menu'
  | 'reminders'
  | 'inbox'
  | 'inbox_detail'
  | 'self_love'
  | 'self_love_breath'
  | 'self_love_song'
  | 'self_love_three_things'
  | 'self_love_break'
  | 'self_love_worth'
  | 'letter'
  | 'secret'
  | 'music'
  | 'final';

export type KeypadKey =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '*'
  | '0'
  | '#'
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'CALL'
  | 'END';

export interface SmsMessage {
  id: string;
  number: string;
  from: string;
  subject: string;
  body: string;
  time: string;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  genre: 'Soft Indie' | 'Warm Acoustic' | 'Gentle Instrumental' | 'Relaxing Lo-Fi' | 'Custom Audio';
  durationSeconds: number;
  bpm: number;
  chords: number[][];
  melody: number[];
  customUrl?: string;
}
