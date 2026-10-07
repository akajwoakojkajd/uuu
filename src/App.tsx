/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Sparkles, Trophy, HelpCircle } from 'lucide-react';

type ActiveTab = 'arcade_wall' | 'spot_nerd' | 'whack_nerd' | 'dodge_finger' | 'memory_nerd';
type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY' | 'GAME_OVER';

interface TrapGame {
  id: string;
  title: string;
  genre: string;
  fakePrompt: string;
  actionLabel: string;
  nerdRevealTitle: string;
  nerdQuote: string;
  nerdEquation: string;
  emojiSequence: string;
}

const TRAP_GAMES: TrapGame[] = [
  {
    id: 'racing',
    title: 'Nitro Drift 3000',
    genre: 'Racing · 120 FPS',
    fakePrompt: 'Press the pedal to hit 300 MPH and overtake 1st place!',
    actionLabel: 'Hit Nitro Boost',
    nerdRevealTitle: 'PULLED OVER BY THE 🤓 POLICE!',
    nerdQuote: '"Erm, actually, considering air resistance and tire friction, your velocity is 100% 🤓🫵🏼!"',
    nerdEquation: 'v = √(2 · 🤓 · 🫵🏼)',
    emojiSequence: '🏎️💨 ➔ 🚨 ➔ 🤓🫵🏼',
  },
  {
    id: 'fps',
    title: 'Tactical Ops: Zero',
    genre: 'Shooter · Ranked',
    fakePrompt: 'Enemy spotted behind cover. Line up the 8x scope and take the shot!',
    actionLabel: 'Zoom Scope (8x)',
    nerdRevealTitle: 'LOOK WHO IS IN THE CROSSHAIRS: 🤓🫵🏼',
    nerdQuote: '"You zoomed in 800% just to see a high-definition reflection of yourself: 🤓🫵🏼"',
    nerdEquation: 'Accuracy: 100% 🤓🫵🏼',
    emojiSequence: '🔭 ➔ 🎯 ➔ 🤓🫵🏼',
  },
  {
    id: 'chess',
    title: 'Grandmaster Chess Bot',
    genre: 'Strategy · ELO 3200',
    fakePrompt: 'White to move and deliver Checkmate in 1 move.',
    actionLabel: 'Play Queen to H7#',
    nerdRevealTitle: 'ILLEGAL MOVE! CHECKMATED BY 🤓🫵🏼',
    nerdQuote: '"Erm, actually, you forgot En Passant on move 4! Therefore, the board officially declares: 🤓🫵🏼"',
    nerdEquation: '1. e4 e5 2. 🤓🫵🏼#',
    emojiSequence: '♟️ ➔ 👑 ➔ 🤓🫵🏼',
  },
  {
    id: 'iq_test',
    title: ' Mensa IQ Test 999+',
    genre: 'Puzzle · Certified',
    fakePrompt: 'Question 1/1: What comes next in the sequence: 2, 4, 8, 16, ...?',
    actionLabel: 'Submit Answer: 32',
    nerdRevealTitle: 'DIAGNOSIS COMPLETE: CERTIFIED 🤓🫵🏼!',
    nerdQuote: '"Only a true 🤓🤓 would actually do math inside a browser game! Look at you: 🤓🫵🏼"',
    nerdEquation: 'IQ = ∞ (Pure 🤓🫵🏼)',
    emojiSequence: '🧠 ➔ 📐 ➔ 🤓🫵🏼',
  },
  {
    id: 'loot_box',
    title: 'Mythic Mystery Chest',
    genre: 'Gacha · 0.01% Drop',
    fakePrompt: 'A glowing golden chest trembles before you. Crack it open for Legendary loot!',
    actionLabel: 'Open Mythic Chest',
    nerdRevealTitle: 'YOU UNBOXED: ULTRA-RARE HOLOGRAPHIC 🤓🫵🏼',
    nerdQuote: '"Congratulations! Out of 10,000 possible items, all 10,000 of them were 🤓🫵🏼!"',
    nerdEquation: 'Drop Rate: 100% 🤓🫵🏼',
    emojiSequence: '📦✨ ➔ 💥 ➔ 🤓🫵🏼',
  },
  {
    id: 'rpg_boss',
    title: 'Shadow Dragon Raid',
    genre: 'RPG · Level 99',
    fakePrompt: 'The Ancient Dragon has 1 HP left! Cast your ultimate spell to save the realm!',
    actionLabel: 'Cast Ultimate Spell',
    nerdRevealTitle: 'THE DRAGON TOOK OFF ITS MASK: 🤓🫵🏼',
    nerdQuote: '"Erm, actually, my armor class is immune to magic unless you admit you are 🤓🫵🏼!"',
    nerdEquation: 'DMG = 9999 🤓🫵🏼',
    emojiSequence: '🐉🔥 ➔ 🎭 ➔ 🤓🫵🏼',
  },
  {
    id: 'mirror',
    title: '4K Face Scanner Pro',
    genre: 'Utility · Biometric',
    fakePrompt: 'Calibrating optical sensors to detect the person looking at this screen right now...',
    actionLabel: 'Reveal Scan Result',
    nerdRevealTitle: '100% BIOMETRIC MATCH FOUND: 🤓🫵🏼',
    nerdQuote: '"Sensor calibration complete. Subject wearing invisible thick-rimmed glasses detected: 🤓🫵🏼"',
    nerdEquation: 'Subject == 🤓🫵🏼 (True)',
    emojiSequence: '📸 ➔ 🔍 ➔ 🤓🫵🏼',
  },
  {
    id: 'crypto',
    title: 'Wall Street Tycoon',
    genre: 'Simulation · Finance',
    fakePrompt: '$NERD coin is pumping +42,000%! Click to cash out your billions!',
    actionLabel: 'Cash Out Billions',
    nerdRevealTitle: 'PAYOUT RECEIVED: 1,000,000,000 🤓🫵🏼',
    nerdQuote: '"Erm, actually, adjusted for inflation, your portfolio consists entirely of 🤓🤓 pointing at you!"',
    nerdEquation: 'ROI = +∞% 🤓🫵🏼',
    emojiSequence: '📈💰 ➔ 🏦 ➔ 🤓🫵🏼',
  },
  {
    id: 'rhythm',
    title: 'Neon Beat Drop',
    genre: 'Music · 180 BPM',
    fakePrompt: 'Wait for the bass drop and hit the note on the exact beat!',
    actionLabel: 'Drop The Bass',
    nerdRevealTitle: 'THE BASS DROPPED: "ERM, ACTUALLY! 🤓🫵🏼"',
    nerdQuote: '"Instead of techno synths, the speaker plays a 140-decibel nasal snort: 🤓🫵🏼"',
    nerdEquation: '180 BPM (Beats Per 🤓)',
    emojiSequence: '🎧🎵 ➔ 🔊 ➔ 🤓🫵🏼',
  },
  {
    id: 'escape',
    title: 'Locked Room Mystery',
    genre: 'Adventure · Escape',
    fakePrompt: 'There is only one door out of this room. Turn the brass handle to escape!',
    actionLabel: 'Open Secret Door',
    nerdRevealTitle: 'BEHIND THE DOOR IS A ROOM FULL OF 🤓🫵🏼',
    nerdQuote: '"There is no escape! Every door on this website leads directly back to 🤓🫵🏼!"',
    nerdEquation: 'Exit == Entrance(🤓🫵🏼)',
    emojiSequence: '🚪🔑 ➔ 👀 ➔ 🤓🫵🏼',
  },
  {
    id: 'dating',
    title: 'Secret Admirer Sim',
    genre: 'Visual Novel · Romance',
    fakePrompt: 'Someone left a mysterious love letter in your locker. Read who wrote it!',
    actionLabel: 'Read Love Letter',
    nerdRevealTitle: 'DEAREST READER: IT WAS 🤓🫵🏼 ALL ALONG!',
    nerdQuote: '"Roses are red, violets are blue, erm actually violets are purple, and look at you: 🤓🫵🏼"',
    nerdEquation: 'Love = 🤓 + 🫵🏼',
    emojiSequence: '💌✨ ➔ 📜 ➔ 🤓🫵🏼',
  },
  {
    id: 'hacker',
    title: 'Mainframe Breacher',
    genre: 'Cyber · Terminal',
    fakePrompt: 'Firewall at 99%. Press Execute to decrypt the top-secret government file!',
    actionLabel: 'Decrypt Top Secret File',
    nerdRevealTitle: 'FILE DECRYPTED: top_secret_nerd.txt ➔ 🤓🫵🏼',
    nerdQuote: '"You hacked into the Pentagon mainframe just to find a 4K JPEG of 🤓🫵🏼!"',
    nerdEquation: 'sudo apt-get install 🤓🫵🏼',
    emojiSequence: '💻🔓 ➔ 📁 ➔ 🤓🫵🏼',
  },
];

const MEMORY_EMOJIS = ['🤓🫵🏼', '🤓☝️', '🤓📚', '🤓👓', '🤓🧪', '🤓📐', '🤓💻', '🤓🏆'];

interface FloatingBurst {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('arcade_wall');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalPointedCount, setTotalPointedCount] = useState<number>(42);
  const [bursts, setBursts] = useState<FloatingBurst[]>([]);

  // Trap Game Modal / Stage State
  const [selectedTrap, setSelectedTrap] = useState<TrapGame>(TRAP_GAMES[0]);
  const [trapTriggered, setTrapTriggered] = useState<boolean>(false);
  const [playedTrapIds, setPlayedTrapIds] = useState<string[]>([]);

  // Mini-game 1: Spot the 🤓🫵🏼
  const [spotState, setSpotState] = useState<GameState>('TITLE_MENU');
  const [spotLevel, setSpotLevel] = useState<number>(1);
  const [spotScore, setSpotScore] = useState<number>(0);
  const [spotTargetIdx, setSpotTargetIdx] = useState<number>(0);
  const [spotTimeLeft, setSpotTimeLeft] = useState<number>(15);

  // Mini-game 2: Whack-a-🤓
  const [whackState, setWhackState] = useState<GameState>('TITLE_MENU');
  const [whackScore, setWhackScore] = useState<number>(0);
  const [whackTimeLeft, setWhackTimeLeft] = useState<number>(20);
  const [activeHoles, setActiveHoles] = useState<Record<number, 'nerd' | 'pointing'>>({});

  // Mini-game 3: Dodge the 🫵🏼
  const [dodgeState, setDodgeState] = useState<GameState>('TITLE_MENU');
  const [playerLane, setPlayerLane] = useState<number>(2);
  const [fallingFingers, setFallingFingers] = useState<{ id: number; lane: number; row: number; emoji: string }[]>([]);
  const [dodgeScore, setDodgeScore] = useState<number>(0);

  // Mini-game 4: 🤓 Memory Match
  const [memoryState, setMemoryState] = useState<GameState>('TITLE_MENU');
  const [memoryCards, setMemoryCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(
    (type: 'nerd_point' | 'pop' | 'win' | 'buzz') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'nerd_point') {
          // Nasal "Erm-Actually!" two-note horn
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
          osc.frequency.setValueAtTime(587.33, now + 0.18); // D5
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.36);
        } else if (type === 'pop') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.11);
        } else if (type === 'win') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          osc.frequency.setValueAtTime(1046.5, now + 0.24);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.46);
        } else {
          osc.type = 'square';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(130, now + 0.25);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.29);
        }
      } catch {
        // Ignore audio errors if blocked
      }
    },
    [soundEnabled]
  );

  const spawnBurst = useCallback((clientX?: number, clientY?: number, customText?: string) => {
    const x = clientX ?? window.innerWidth / 2 + (Math.random() * 240 - 120);
    const y = clientY ?? window.innerHeight / 2 + (Math.random() * 120 - 60);
    const options = ['🤓🫵🏼', '🤓🤓', '🤓☝️', 'ERM ACTUALLY 🤓🫵🏼', '100% 🤓🫵🏼'];
    const text = customText ?? options[Math.floor(Math.random() * options.length)];
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev.slice(-14), { id, x, y, text }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 750);
  }, []);

  const incrementPointed = useCallback(
    (e?: React.MouseEvent, customBurst?: string) => {
      setTotalPointedCount((c) => c + 1);
      playSound('nerd_point');
      spawnBurst(e?.clientX, e?.clientY, customBurst ?? '🤓🫵🏼');
    },
    [playSound, spawnBurst]
  );

  // --- Spot the 🤓🫵🏼 Logic ---
  const gridCount = Math.min(12 + spotLevel * 6, 48);
  const startSpotGame = () => {
    setSpotLevel(1);
    setSpotScore(0);
    setSpotTimeLeft(15);
    setSpotTargetIdx(Math.floor(Math.random() * 18));
    setSpotState('PLAYING');
    playSound('pop');
  };

  useEffect(() => {
    if (spotState !== 'PLAYING') return;
    const timer = setInterval(() => {
      setSpotTimeLeft((t) => {
        if (t <= 1) {
          setSpotState('GAME_OVER');
          playSound('nerd_point');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [spotState, playSound]);

  const handleSpotClick = (idx: number, e: React.MouseEvent) => {
    if (spotState !== 'PLAYING') return;
    if (idx === spotTargetIdx) {
      const nextLevel = spotLevel + 1;
      const nextCount = Math.min(12 + nextLevel * 6, 48);
      setSpotScore((s) => s + 100 * spotLevel);
      setSpotLevel(nextLevel);
      setSpotTimeLeft((t) => Math.min(t + 2, 20));
      setSpotTargetIdx(Math.floor(Math.random() * nextCount));
      setTotalPointedCount((c) => c + 1);
      playSound('win');
      spawnBurst(e.clientX, e.clientY, 'FOUND 🤓🫵🏼!');
    } else {
      setSpotTimeLeft((t) => Math.max(1, t - 2));
      playSound('buzz');
      spawnBurst(e.clientX, e.clientY, 'WRONG 🤓!');
    }
  };

  // --- Whack-a-🤓 Logic ---
  const startWhackGame = () => {
    setWhackScore(0);
    setWhackTimeLeft(20);
    setActiveHoles({});
    setWhackState('PLAYING');
    playSound('pop');
  };

  useEffect(() => {
    if (whackState !== 'PLAYING') return;
    const countdown = setInterval(() => {
      setWhackTimeLeft((t) => {
        if (t <= 1) {
          setWhackState('GAME_OVER');
          playSound('win');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      setActiveHoles((prev) => {
        const next = { ...prev };
        // Remove random old hole
        const keys = Object.keys(next).map(Number);
        if (keys.length > 3) {
          delete next[keys[0]];
        }
        const hole = Math.floor(Math.random() * 9);
        next[hole] = Math.random() > 0.35 ? 'pointing' : 'nerd';
        return next;
      });
    }, 480);

    return () => {
      clearInterval(countdown);
      clearInterval(spawner);
    };
  }, [whackState, playSound]);

  const handleWhackHole = (holeIdx: number, e: React.MouseEvent) => {
    if (whackState !== 'PLAYING') return;
    const occupant = activeHoles[holeIdx];
    if (!occupant) return;
    setActiveHoles((prev) => {
      const copy = { ...prev };
      delete copy[holeIdx];
      return copy;
    });
    const pts = occupant === 'pointing' ? 150 : 100;
    setWhackScore((s) => s + pts);
    setTotalPointedCount((c) => c + 1);
    playSound('nerd_point');
    spawnBurst(e.clientX, e.clientY, `+${pts} 🤓🫵🏼`);
  };

  // --- Dodge the 🫵🏼 Logic ---
  const startDodgeGame = () => {
    setPlayerLane(2);
    setFallingFingers([]);
    setDodgeScore(0);
    setDodgeState('PLAYING');
    playSound('pop');
  };

  useEffect(() => {
    if (dodgeState !== 'PLAYING') return;
    const tick = setInterval(() => {
      setFallingFingers((prev) => {
        const advanced = prev
          .map((f) => ({ ...f, row: f.row + 1 }))
          .filter((f) => f.row <= 5);

        // Spawn a new finger at row 0
        const newLane = Math.floor(Math.random() * 5);
        const emojis = ['🫵🏼', '🤓🫵🏼', '☝️🤓'];
        advanced.push({
          id: Date.now() + Math.random(),
          lane: newLane,
          row: 0,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
        return advanced;
      });
      setDodgeScore((s) => s + 10);
    }, 340);

    return () => clearInterval(tick);
  }, [dodgeState]);

  useEffect(() => {
    if (dodgeState !== 'PLAYING') return;
    const hit = fallingFingers.some((f) => f.row === 4 && f.lane === playerLane);
    if (hit) {
      setDodgeState('GAME_OVER');
      setTotalPointedCount((c) => c + 1);
      playSound('nerd_point');
      spawnBurst(undefined, undefined, 'CAUGHT BY 🤓🫵🏼!');
    }
  }, [fallingFingers, playerLane, dodgeState, playSound, spawnBurst]);

  // Keyboard support for Dodge game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'dodge_finger' || dodgeState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerLane((l) => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerLane((l) => Math.min(4, l + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, dodgeState]);

  // --- Memory Match Logic ---
  const startMemoryGame = () => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        flipped: false,
        matched: false,
      }));
    setMemoryCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryState('PLAYING');
    playSound('pop');
  };

  const handleCardFlip = (idx: number, e: React.MouseEvent) => {
    if (memoryState !== 'PLAYING') return;
    if (flippedIndices.length >= 2) return;
    if (memoryCards[idx].flipped || memoryCards[idx].matched) return;

    const updated = memoryCards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setMemoryCards(updated);
    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);
    playSound('pop');

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = nextFlipped;
      if (updated[first].emoji === updated[second].emoji) {
        setTimeout(() => {
          setMemoryCards((prev) => {
            const afterMatch = prev.map((c, i) =>
              i === first || i === second ? { ...c, matched: true } : c
            );
            if (afterMatch.every((c) => c.matched)) {
              setMemoryState('GAME_OVER');
            }
            return afterMatch;
          });
          setFlippedIndices([]);
          setTotalPointedCount((c) => c + 1);
          playSound('win');
          spawnBurst(e.clientX, e.clientY, 'MATCHED 🤓🫵🏼!');
        }, 250);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, flipped: false } : c))
          );
          setFlippedIndices([]);
        }, 650);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col justify-between relative">
      {/* Floating Click Bursts */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {bursts.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.x}px`, top: `${b.y}px` }}
            className="fixed -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-bold animate-float-up whitespace-nowrap drop-shadow-md"
          >
            {b.text}
          </div>
        ))}
      </div>

      {/* Top Bar Contract: Zone 1 (Big 🤓🤓🤓🤓 Title at Top Corner) — Zone 2 (Nav Links) — Zone 3 (Actions) */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Big title at the top corner “🤓🤓🤓🤓” */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('arcade_wall');
              setTrapTriggered(false);
              incrementPointed(e, '🤓🫵🏼');
            }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-400 font-display whitespace-nowrap shrink-0 hover:scale-105 transition-transform"
          >
            🤓🤓🤓🤓
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => {
                setActiveTab('arcade_wall');
                setTrapTriggered(false);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'arcade_wall' ? 'border-amber-400 text-white' : 'border-transparent'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveTab('spot_nerd')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'spot_nerd' ? 'border-amber-400 text-white' : 'border-transparent'
              }`}
            >
               Emoji Hunt
            </button>
            <button
              onClick={() => setActiveTab('whack_nerd')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'whack_nerd' ? 'border-amber-400 text-white' : 'border-transparent'
              }`}
            >
              Reflex Tap
            </button>
            <button
              onClick={() => setActiveTab('dodge_finger')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'dodge_finger' ? 'border-amber-400 text-white' : 'border-transparent'
              }`}
            >
              Lane Runner
            </button>
            <button
              onClick={() => setActiveTab('memory_nerd')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'memory_nerd' ? 'border-amber-400 text-white' : 'border-transparent'
              }`}
            >
              Card Match
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? 'SFX On' : 'Muted'}</span>
            </button>
            <button
              onClick={(e) => incrementPointed(e, '🤓🫵🏼')}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 whitespace-nowrap"
            >
              🤓 Score: <span className="font-mono-tabular">{totalPointedCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Simple Header Banner with 🤓🤓 and Zero Spoilers */}
        <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl text-center lg:text-left">
            <div className="text-xs text-amber-400 font-semibold tracking-wide">
              🤓🤓 · Free Browser Arcade · Instant Play · 🤓🤓
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome to 🤓🤓🤓🤓 Game Center
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Click any game button below to start playing right away.
            </p>
            {/* Mobile / Tablet Quick Mode Switcher */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-2 md:hidden">
              {(
                [
                  ['arcade_wall', 'All Games'],
                  ['spot_nerd', 'Emoji Hunt'],
                  ['whack_nerd', 'Reflex Tap'],
                  ['dodge_finger', 'Lane Runner'],
                  ['memory_nerd', 'Card Match'],
                ] as [ActiveTab, string][]
              ).map(([tabId, label]) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tabId
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mystery Bonus Button (Reveals 🤓🫵🏼 on click) */}
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={(e) => {
                setTrapTriggered(true);
                incrementPointed(e, '🤓🫵🏼');
              }}
              className="group relative bg-slate-900 hover:bg-slate-950 border border-slate-700 hover:border-amber-400/60 rounded-2xl px-8 py-5 transition-transform active:scale-95 flex flex-col items-center gap-1.5"
            >
              <div className="text-5xl sm:text-6xl tracking-tighter transition-transform group-hover:scale-110">
                {trapTriggered ? '🤓🫵🏼' : '🤓🤓'}
              </div>
              <span className="text-xs font-semibold text-amber-400 whitespace-nowrap">
                {trapTriggered ? 'IT IS YOU: 🤓🫵🏼' : 'Click For Daily Bonus 🤓'}
              </span>
            </button>
          </div>
        </section>

        {/* VIEW 1: THE 12 GAMES */}
        {activeTab === 'arcade_wall' && (
          <div className="space-y-8">
            {/* Active Stage showing the selected game */}
            <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="space-y-4 flex-1 w-full">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{selectedTrap.genre}</span>
                    <span>·</span>
                    <span className="font-mono-tabular">
                      Games Played: {playedTrapIds.length} / {TRAP_GAMES.length}
                    </span>
                  </div>

                  {!trapTriggered ? (
                    <div className="space-y-5 py-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        {selectedTrap.title}
                      </h2>
                      <p className="text-slate-300 text-base max-w-xl">
                        {selectedTrap.fakePrompt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          onClick={(e) => {
                            setTrapTriggered(true);
                            if (!playedTrapIds.includes(selectedTrap.id)) {
                              setPlayedTrapIds((prev) => [...prev, selectedTrap.id]);
                            }
                            incrementPointed(e, '🤓🫵🏼');
                          }}
                          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{selectedTrap.actionLabel}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            const randomTrap =
                              TRAP_GAMES[Math.floor(Math.random() * TRAP_GAMES.length)];
                            setSelectedTrap(randomTrap);
                            setTrapTriggered(true);
                            if (!playedTrapIds.includes(randomTrap.id)) {
                              setPlayedTrapIds((prev) => [...prev, randomTrap.id]);
                            }
                            incrementPointed(e, '🤓🫵🏼');
                          }}
                          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Quick Random Game</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      <div className="text-xs font-semibold text-emerald-400">
                        {selectedTrap.emojiSequence}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                        {selectedTrap.nerdRevealTitle}
                      </h2>
                      <p className="text-slate-200 text-base italic max-w-2xl">
                        {selectedTrap.nerdQuote}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <span className="text-xs font-mono-tabular text-slate-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                          {selectedTrap.nerdEquation}
                        </span>
                        <button
                          onClick={() => setTrapTriggered(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Back to Game</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stage Visual Display */}
                <div
                  onClick={(e) => {
                    setTrapTriggered(true);
                    if (!playedTrapIds.includes(selectedTrap.id)) {
                      setPlayedTrapIds((prev) => [...prev, selectedTrap.id]);
                    }
                    incrementPointed(e, '🤓🫵🏼');
                  }}
                  className="w-full lg:w-80 h-52 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-amber-400/50 transition-colors shrink-0"
                >
                  {!trapTriggered ? (
                    <div className="space-y-3">
                      <div className="text-5xl">🤓🎮</div>
                      <div className="text-sm font-bold text-white">{selectedTrap.title}</div>
                      <div className="text-xs text-slate-400">
                        Click to start game
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-bounce">
                      <div className="text-6xl sm:text-7xl">🤓🫵🏼</div>
                      <div className="text-xs font-bold text-amber-400">
                        🤓🫵🏼
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Grid of 12 Game Buttons */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-white">
                  🤓🤓 Featured Games
                </h2>
                <div className="text-xs text-slate-400">
                  Select any button to launch
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {TRAP_GAMES.map((game, idx) => {
                  const isSelected = selectedTrap.id === game.id;
                  const isDiscovered = playedTrapIds.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      onClick={(e) => {
                        setSelectedTrap(game);
                        setTrapTriggered(true);
                        if (!playedTrapIds.includes(game.id)) {
                          setPlayedTrapIds((prev) => [...prev, game.id]);
                        }
                        incrementPointed(e, '🤓🫵🏼');
                      }}
                      className={`text-left p-5 rounded-xl border transition-all flex flex-col justify-between gap-4 ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-400'
                          : 'bg-[#1E293B] border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>
                            {String(idx + 1).padStart(2, '0')}. {game.genre}
                          </span>
                          <span>{isDiscovered ? '🤓🫵🏼' : '🤓'}</span>
                        </div>
                        <h3 className="text-base font-bold text-white">{game.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-2">{game.fakePrompt}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                        <span className={isDiscovered ? 'text-amber-400' : 'text-emerald-400'}>
                          {isDiscovered ? '🤓🫵🏼' : game.actionLabel}
                        </span>
                        <span className="text-slate-400">Play ➔</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Quick Launch Bar for the 4 Full Mini-Games */}
            <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-white">
                  🤓🤓 Arcade Mini-Games
                </h2>
                <span className="text-xs text-slate-400">
                  4 Endless Modes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('spot_nerd');
                    startSpotGame();
                  }}
                  className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <div className="text-2xl">🤓🔎</div>
                  <div className="text-sm font-bold text-white">01. Emoji Hunt</div>
                  <div className="text-xs text-slate-400">
                    Test your observation speed on the grid.
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('whack_nerd');
                    startWhackGame();
                  }}
                  className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <div className="text-2xl">🔨🤓</div>
                  <div className="text-sm font-bold text-white">02. Reflex Tap</div>
                  <div className="text-xs text-slate-400">
                    Fast-paced 9-hole arcade reflex challenge.
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('dodge_finger');
                    startDodgeGame();
                  }}
                  className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <div className="text-2xl">🏃‍♂️🤓</div>
                  <div className="text-sm font-bold text-white">03. Lane Runner</div>
                  <div className="text-xs text-slate-400">
                    Switch lanes to survive the falling obstacles.
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('memory_nerd');
                    startMemoryGame();
                  }}
                  className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <div className="text-2xl">🃏🤓</div>
                  <div className="text-sm font-bold text-white">04. Card Match</div>
                  <div className="text-xs text-slate-400">
                    Classic 16-card memory puzzle board.
                  </div>
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SPOT THE 🤓🫵🏼 IN A SEA OF 🤓🤓 */}
        {activeTab === 'spot_nerd' && (
          <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Spot The 🤓🫵🏼 In The 🤓🤓 Sea</h2>
                <p className="text-xs text-slate-400">
                  Every tile is 🤓, except ONE that is pointing right at you (🤓🫵🏼). Tap it fast!
                </p>
              </div>
              <div className="flex items-center gap-6 font-mono-tabular text-sm">
                <span>Level: {spotLevel}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold">Score: {spotScore}</span>
                <span>·</span>
                <span className={spotTimeLeft <= 5 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  Time: {spotTimeLeft}s
                </span>
              </div>
            </div>

            {spotState === 'TITLE_MENU' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🤓🤓🤓🫵🏼🤓</div>
                <h3 className="text-xl font-bold text-white">Can You Spot Who Is Pointing At You?</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Each level adds more 🤓🤓 to the board. Finding 🤓🫵🏼 grants +2 bonus seconds!
                </p>
                <button
                  onClick={startSpotGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Start Game (🤓🫵🏼)
                </button>
              </div>
            )}

            {spotState === 'PLAYING' && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                {Array.from({ length: gridCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => handleSpotClick(idx, e)}
                    className="h-14 sm:h-16 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-2xl sm:text-3xl transition-transform active:scale-90"
                  >
                    {idx === spotTargetIdx ? '🤓🫵🏼' : '🤓'}
                  </button>
                ))}
              </div>
            )}

            {spotState === 'GAME_OVER' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🤓🫵🏼</div>
                <h3 className="text-2xl font-bold text-amber-400">
                  Time Up! You Reached Level {spotLevel} With {spotScore} Points!
                </h3>
                <p className="text-sm text-slate-300">
                  &quot;Erm, actually, the real 🤓🫵🏼 was looking at the screen the whole time!&quot;
                </p>
                <button
                  onClick={startSpotGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Play Again
                </button>
              </div>
            )}
          </section>
        )}

        {/* VIEW 3: WHACK-A-🤓 */}
        {activeTab === 'whack_nerd' && (
          <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Whack-a-🤓 (&quot;Erm, Actually!&quot; Defense)
                </h2>
                <p className="text-xs text-slate-400">
                  Tap the 🤓 (+100) and 🤓🫵🏼 (+150) before they duck back into their holes!
                </p>
              </div>
              <div className="flex items-center gap-6 font-mono-tabular text-sm">
                <span className="text-amber-400 font-bold">Score: {whackScore}</span>
                <span>·</span>
                <span className="text-emerald-400">Time: {whackTimeLeft}s</span>
              </div>
            </div>

            {whackState === 'TITLE_MENU' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🔨🤓🫵🏼</div>
                <h3 className="text-xl font-bold text-white">Stop The 🤓🤓 From Correcting You!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  20 seconds on the clock. Every 🤓 you tap adds to the global 🤓🫵🏼 counter!
                </p>
                <button
                  onClick={startWhackGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Start Whacking 🤓
                </button>
              </div>
            )}

            {whackState === 'PLAYING' && (
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto py-4">
                {Array.from({ length: 9 }).map((_, idx) => {
                  const occupant = activeHoles[idx];
                  return (
                    <button
                      key={idx}
                      onClick={(e) => handleWhackHole(idx, e)}
                      className={`h-28 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        occupant
                          ? 'bg-slate-800 border-amber-400 scale-105'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl">
                        {occupant === 'pointing' ? '🤓🫵🏼' : occupant === 'nerd' ? '🤓' : '🕳️'}
                      </span>
                      {occupant && (
                        <span className="text-[11px] font-semibold text-amber-300 mt-1">
                          {occupant === 'pointing' ? '🤓🫵🏼 +150' : 'Erm! +100'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {whackState === 'GAME_OVER' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🏆🤓🫵🏼</div>
                <h3 className="text-2xl font-bold text-amber-400">
                  Round Complete! Final Score: {whackScore}
                </h3>
                <p className="text-sm text-slate-300">
                  Even after whacking all those 🤓🤓, one final 🤓🫵🏼 still points at you!
                </p>
                <button
                  onClick={startWhackGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Play Again
                </button>
              </div>
            )}
          </section>
        )}

        {/* VIEW 4: DODGE THE 🫵🏼 FINGER */}
        {activeTab === 'dodge_finger' && (
          <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Dodge The 🫵🏼 (Don&apos;t Let Them Point At You!)
                </h2>
                <p className="text-xs text-slate-400">
                  Use Left/Right buttons (or Arrow keys) to dodge the falling 🫵🏼 fingers!
                </p>
              </div>
              <div className="font-mono-tabular text-sm text-amber-400 font-bold">
                Score: {dodgeScore}
              </div>
            </div>

            {dodgeState === 'TITLE_MENU' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🫵🏼⬇️🤓</div>
                <h3 className="text-xl font-bold text-white">You Are 🤓. Dodge Every 🫵🏼!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  If a falling 🫵🏼 lands on your lane, you officially become 🤓🫵🏼!
                </p>
                <button
                  onClick={startDodgeGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Start Dodging
                </button>
              </div>
            )}

            {dodgeState === 'PLAYING' && (
              <div className="max-w-lg mx-auto space-y-4">
                <div className="grid grid-cols-5 gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  {Array.from({ length: 5 }).map((_, rowIdx) =>
                    Array.from({ length: 5 }).map((__, colIdx) => {
                      const isPlayer = rowIdx === 4 && colIdx === playerLane;
                      const falling = fallingFingers.find(
                        (f) => f.row === rowIdx && f.lane === colIdx
                      );
                      return (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          onClick={() => setPlayerLane(colIdx)}
                          className={`h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl cursor-pointer transition-colors ${
                            isPlayer
                              ? 'bg-amber-400/20 border border-amber-400'
                              : 'bg-slate-950/60 border border-slate-800/60'
                          }`}
                        >
                          {isPlayer ? '🤓' : falling ? falling.emoji : ''}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPlayerLane((l) => Math.max(0, l - 1))}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                  >
                    ⬅️ Move Left
                  </button>
                  <button
                    onClick={() => setPlayerLane((l) => Math.min(4, l + 1))}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                  >
                    Move Right ➡️
                  </button>
                </div>
              </div>
            )}

            {dodgeState === 'GAME_OVER' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🤓🫵🏼</div>
                <h3 className="text-2xl font-bold text-amber-400">
                  POINTED AT! Final Dodge Score: {dodgeScore}
                </h3>
                <p className="text-sm text-slate-300">
                  You dodged as hard as you could, but destiny still arrived: 🤓🫵🏼
                </p>
                <button
                  onClick={startDodgeGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Play Again
                </button>
              </div>
            )}
          </section>
        )}

        {/* VIEW 5: 🤓 MEMORY MATCH */}
        {activeTab === 'memory_nerd' && (
          <section className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  🤓🤓 Memory Match (Every Card Is A 🤓)
                </h2>
                <p className="text-xs text-slate-400">
                  Flip the cards to match all 8 pairs of 🤓 variations!
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono-tabular text-sm">
                <span className="text-amber-400 font-bold">Moves: {memoryMoves}</span>
                <button
                  onClick={startMemoryGame}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg whitespace-nowrap"
                >
                  Shuffle Deck
                </button>
              </div>
            </div>

            {memoryState === 'TITLE_MENU' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🃏🤓🫵🏼</div>
                <h3 className="text-xl font-bold text-white">Test Your 🤓🤓 Photographic Memory</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Find matching pairs of 🤓🫵🏼, 🤓☝️, 🤓📚, 🤓👓, 🤓🧪, 🤓📐, 🤓💻, and 🤓🏆!
                </p>
                <button
                  onClick={startMemoryGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Deal 🤓 Cards
                </button>
              </div>
            )}

            {memoryState === 'PLAYING' && (
              <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                {memoryCards.map((card, idx) => (
                  <button
                    key={card.id}
                    onClick={(e) => handleCardFlip(idx, e)}
                    className={`h-20 sm:h-24 rounded-xl border text-2xl sm:text-3xl font-bold flex items-center justify-center transition-all ${
                      card.flipped || card.matched
                        ? 'bg-slate-800 border-amber-400 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                    }`}
                  >
                    {card.flipped || card.matched ? card.emoji : '🤓?'}
                  </button>
                ))}
              </div>
            )}

            {memoryState === 'GAME_OVER' && (
              <div className="py-12 text-center space-y-4">
                <div className="text-6xl">🎉🤓🫵🏼</div>
                <h3 className="text-2xl font-bold text-amber-400">
                  All 8 🤓 Pairs Matched in {memoryMoves} Moves!
                </h3>
                <p className="text-sm text-slate-300">
                  Only a supreme 🤓🫵🏼 could memorize every single 🤓 emoji that fast!
                </p>
                <button
                  onClick={startMemoryGame}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-transform active:scale-95 whitespace-nowrap"
                >
                  Play Again
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 py-5 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🤓🤓🤓🤓 · Official Browser Game Hub</span>
          <button
            onClick={(e) => {
              setTrapTriggered(true);
              incrementPointed(e, '🤓🫵🏼');
            }}
            className="text-amber-400 hover:underline whitespace-nowrap"
          >
            Claim Secret Gift 🎁
          </button>
        </div>
      </footer>
    </div>
  );
}

