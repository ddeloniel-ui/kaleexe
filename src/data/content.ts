import { PlaylistTrack, SmsMessage } from '../types';

export const REMINDERS: string[] = [
  "Hey Kale, just a reminder that you're going to be okay.",
  "You don't have to be completely fine today. Take your time.",
  "Losing someone doesn't mean you've lost yourself.",
  "You are still worthy of love, care, and happiness.",
  "Don't blame yourself for everything that didn't work out.",
  "Sometimes letting go is also a way of choosing yourself.",
  "You deserve a love that feels peaceful, not confusing.",
  "It's okay to miss someone and still know that moving forward is the right thing.",
  "Healing isn't a race. There's no deadline.",
  "Some days will feel heavier than others. That's completely okay.",
  "Please don't forget the person you were before all of this.",
  "Your happiness doesn't have to depend on someone's presence.",
  "You deserve consistency, honesty, and genuine affection.",
  "Don't settle for less just because you're afraid of being alone.",
  "Take yourself on little adventures. Make new memories.",
  "There are still songs you haven't heard and places you haven't visited.",
  "One ending doesn't erase all the beautiful things waiting ahead.",
  "Be gentle with yourself. You're learning too.",
  "Don't rush into being okay just to prove something to anyone.",
  "Remember to eat properly, sleep enough, and take care of yourself.",
  "You are not difficult to love just because one relationship didn't work out.",
  "Better days don't always arrive loudly. Sometimes they begin quietly.",
  "I hope you find reasons to smile that have nothing to do with the past.",
  "Your next chapter deserves a happier version of you.",
  "And finally, Kale, I'm rooting for you. Always remember that you're not alone.",
];

export const INBOX_MESSAGES: SmsMessage[] = [
  {
    id: 'sms-1',
    number: '01',
    from: 'YOUR FRIEND',
    subject: 'HEY, YOU OKAY?',
    time: '09:14',
    body: "Just checking in. I hope you're taking care of yourself. No pressure to reply, just wanted you to know someone is thinking of you.",
  },
  {
    id: 'sms-2',
    number: '02',
    from: 'SOMEONE WHO CARES',
    subject: 'A LITTLE REMINDER',
    time: '12:30',
    body: "You don't have to pretend to be okay all the time. It's fine to have difficult days.",
  },
  {
    id: 'sms-3',
    number: '03',
    from: 'KALE.exe',
    subject: 'PLEASE REMEMBER',
    time: '15:45',
    body: "Never make someone else's decision about staying or leaving determine how you see yourself.",
  },
  {
    id: 'sms-4',
    number: '04',
    from: 'YOUR FRIEND',
    subject: 'GO OUTSIDE SOMETIME',
    time: '17:20',
    body: "Get some fresh air, listen to your favorite songs, eat something nice, and let yourself enjoy the little things again.",
  },
  {
    id: 'sms-5',
    number: '05',
    from: 'YOUR FRIEND',
    subject: 'ONE LAST THING',
    time: '21:05',
    body: "Your story is still going, Kale. Don't let one chapter convince you that the whole book is sad.",
  },
];

export const SELF_LOVE_MENU_ITEMS = [
  { id: 'breath', label: '1. TAKE A DEEP BREATH' },
  { id: 'song', label: '2. PLAY YOUR FAVORITE SONG' },
  { id: 'three', label: '3. NAME THREE GOOD THINGS' },
  { id: 'break', label: '4. TAKE A LITTLE BREAK' },
  { id: 'worth', label: '5. REMIND YOURSELF OF YOUR WORTH' },
] as const;

export const WORTH_AFFIRMATIONS: string[] = [
  "You are still the same kind, thoughtful person you were before.",
  "Your value is not up for negotiation based on one person's choice.",
  "You bring warmth to the people around you simply by being yourself.",
  "A closed door does not mean you weren't enough. It just wasn't your room.",
  "You deserve someone who stays gently, chooses you clearly, and listens well.",
  "You are allowed to outgrow chapters that made you shrink.",
];

export const BREAK_PROMPTS: string[] = [
  "Unclench your jaw. Drop your shoulders down an inch.",
  "Grab a glass of water or make something warm to drink.",
  "Look out a window for 20 seconds and let your eyes rest.",
  "No problem has to be solved in the next five minutes.",
];

export const PERSONAL_LETTER = `Dear Kale,

I know things might feel a little different right now.

Maybe there are moments when you still think about what happened, moments when certain memories come back, or days when moving forward feels harder than expected.

I just want you to know that it's okay.

You don't have to rush your healing, and you don't have to pretend that everything is fine when it isn't.

But please, don't forget yourself in the process.

Don't let the end of one relationship make you question your worth. You are still the same person with so many wonderful things ahead of you.

I hope you give yourself the chance to discover new things, meet new people, enjoy your own company, and create memories that make you genuinely happy.

You deserve to feel appreciated without having to beg for it. You deserve peace, honesty, and a kind of happiness that doesn't make you question yourself.

And whenever you feel like things are getting a little too heavy, remember that you don't have to figure everything out alone.

I'm glad to have you as a friend, and I genuinely hope life brings you softer days and better experiences.

Take your time, Kale.

One day, you'll look back and realize that this was just one part of your journey, not the end of it.

Keep going. Better things are waiting for you.

With care,

Your friend. ♥

P.S. Don't forget to smile sometimes. You still look better when you're happy.`;

export const SECRET_MESSAGE_TEXT = `Hey Kale,

I know I can't magically make everything better, but I hope this little website reminds you that there are people who genuinely want to see you happy.

You deserve to laugh without worrying, sleep without overthinking, and wake up excited about your own life again.

Please don't give up on the good things just because something didn't work out.

I'm rooting for you, buddy.

YOU GOT THIS, KALE. ♥`;

export const FINAL_MESSAGE_TEXT = `Hey Kale,

I hope this little phone made you smile, even just a little.

Remember that your life is so much bigger than one relationship.

There are new memories to make, new places to discover, new people to meet, and so many reasons to be happy again.

Be patient with yourself.

You deserve good things.

Always rooting for you. ♥

— YOUR FRIEND`;

export const DEFAULT_PLAYLIST: PlaylistTrack[] = [
  {
    id: 'track-rehat',
    title: 'REHAT',
    artist: 'KUNTO AJI',
    genre: 'Soft Indie',
    durationSeconds: 359,
    bpm: 74,
    chords: [
      [261.63, 329.63, 392.0, 493.88],
    ],
    melody: [523.25],
    customUrl: '/assets/aistudio/Kunto_Aji_-_Rehat__Official_Music_Video__1d59d4f5.mp3',
  },
  {
    id: 'track-1',
    title: 'MORNING WINDOW',
    artist: 'WARM ACOUSTIC',
    genre: 'Warm Acoustic',
    durationSeconds: 148,
    bpm: 72,
    // Cmaj7 -> Am7 -> Fmaj7 -> G6
    chords: [
      [261.63, 329.63, 392.0, 493.88],
      [220.0, 261.63, 329.63, 392.0],
      [174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66, 329.63],
    ],
    melody: [523.25, 493.88, 392.0, 440.0, 392.0, 329.63, 293.66, 329.63],
  },
  {
    id: 'track-2',
    title: 'QUIET WALK HOME',
    artist: 'SOFT INDIE TAPE',
    genre: 'Soft Indie',
    durationSeconds: 164,
    bpm: 68,
    // Fmaj7 -> G6 -> Em7 -> Am7
    chords: [
      [174.61, 220.0, 261.63, 329.63],
      [196.0, 246.94, 293.66, 329.63],
      [164.81, 196.0, 246.94, 293.66],
      [220.0, 261.63, 329.63, 392.0],
    ],
    melody: [440.0, 523.25, 493.88, 392.0, 329.63, 392.0, 440.0, 523.25],
  },
  {
    id: 'track-3',
    title: 'PAPER LANTERNS',
    artist: 'GENTLE KEYS',
    genre: 'Gentle Instrumental',
    durationSeconds: 136,
    bpm: 64,
    // Dmaj7 -> Bm7 -> Gmaj7 -> A6
    chords: [
      [293.66, 369.99, 440.0, 554.37],
      [246.94, 293.66, 369.99, 440.0],
      [196.0, 246.94, 293.66, 369.99],
      [220.0, 277.18, 329.63, 369.99],
    ],
    melody: [587.33, 554.37, 440.0, 369.99, 440.0, 493.88, 440.0, 369.99],
  },
  {
    id: 'track-4',
    title: 'RAIN AT 11PM',
    artist: 'LO-FI CASSETTE',
    genre: 'Relaxing Lo-Fi',
    durationSeconds: 182,
    bpm: 60,
    // Ebmaj7 -> Cm9 -> Abmaj7 -> Bb6
    chords: [
      [155.56, 196.0, 233.08, 293.66],
      [130.81, 155.56, 196.0, 293.66],
      [207.65, 261.63, 311.13, 392.0],
      [233.08, 293.66, 349.23, 392.0],
    ],
    melody: [392.0, 466.16, 440.0, 349.23, 311.13, 349.23, 392.0, 466.16],
  },
];
