import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Google Font: Nunito ---
if (!document.getElementById("nunito-font")) {
  const link = document.createElement("link");
  link.id = "nunito-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(link);
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "mindgarden_v4";
const MAX_PLAYS_PER_GAME = 2;
const TOTAL_ACTIVITIES = 5;

const POINTS = {
  ACTIVITY_COMPLETE: 10,
  ALL_COMPLETE_BONUS: 50,
  CORRECT_ANSWER: 5,
  PUZZLE_SOLVE: 15,
  STREAK_7: 100,
  STREAK_15: 200,
  STREAK_30: 500,
};

const STREAK_MILESTONES = [
  { days: 7,  bonus: POINTS.STREAK_7,  label: "Week Warrior",    emoji: "🏆" },
  { days: 15, bonus: POINTS.STREAK_15, label: "Garden Guardian", emoji: "🌟" },
  { days: 30, bonus: POINTS.STREAK_30, label: "Nature Master",   emoji: "👑" },
];

const STORE_ITEMS = [
  { id: "extra_plant", name: "Rare Plant",        emoji: "🌴", cost: 100, desc: "Unlock a tropical palm in your garden"    },
  { id: "butterfly",   name: "Butterfly Garden",  emoji: "🦋", cost: 150, desc: "Butterflies float through your garden"   },
  { id: "calm_theme",  name: "Sunset Theme",      emoji: "🌅", cost: 200, desc: "Paint your sky with golden sunset hues"  },
  { id: "fireflies",   name: "Firefly Night",     emoji: "✨", cost: 120, desc: "Glowing fireflies dance at dusk"          },
  { id: "rainbow",     name: "Rainbow Arc",       emoji: "🌈", cost: 180, desc: "A rainbow stretches across your garden"  },
  { id: "koi_pond",    name: "Koi Pond",          emoji: "🐠", cost: 250, desc: "A shimmering pond appears in your garden" },
];

// ─── Math Level System ────────────────────────────────────────────────────────
// Level is derived from totalDays played (stored in state).
// Day 1-3   → Level 1: single-digit add / subtract
// Day 4-7   → Level 2: larger add/sub, easy multiply
// Day 8-14  → Level 3: 2-digit ops, multiply & divide
// Day 15-21 → Level 4: harder multiply, chained ops
// Day 22-29 → Level 5: 3-digit numbers, multi-step
// Day 30+   → Level 6: algebra intro, large multiply, multi-step

function getMathLevel(totalDays) {
  if (totalDays <= 3)  return 1;
  if (totalDays <= 7)  return 2;
  if (totalDays <= 14) return 3;
  if (totalDays <= 21) return 4;
  if (totalDays <= 29) return 5;
  return 6;
}

function r(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateMathQuestion(level) {
  const gens = {
    1: () => {
      if (r(0,1)) { const a=r(1,9),b=r(1,9); return { q:`${a} + ${b}`, a:a+b }; }
      const a=r(3,10),b=r(1,a-1); return { q:`${a} - ${b}`, a:a-b };
    },
    2: () => {
      const t=r(0,2);
      if (t===0) { const a=r(5,18),b=r(5,18); return { q:`${a} + ${b}`, a:a+b }; }
      if (t===1) { const a=r(8,20),b=r(2,a-1); return { q:`${a} - ${b}`, a:a-b }; }
      const a=r(2,6),b=r(2,6); return { q:`${a} x ${b}`, a:a*b };
    },
    3: () => {
      const t=r(0,3);
      if (t===0) { const a=r(15,55),b=r(15,55); return { q:`${a} + ${b}`, a:a+b }; }
      if (t===1) { const a=r(20,65),b=r(5,a-5); return { q:`${a} - ${b}`, a:a-b }; }
      if (t===2) { const a=r(3,9),b=r(3,9); return { q:`${a} x ${b}`, a:a*b }; }
      const b=r(2,9),a=b*r(2,9); return { q:`${a} / ${b}`, a:a/b };
    },
    4: () => {
      const t=r(0,3);
      if (t===0) { const a=r(25,85),b=r(25,85); return { q:`${a} + ${b}`, a:a+b }; }
      if (t===1) { const a=r(35,99),b=r(10,a-10); return { q:`${a} - ${b}`, a:a-b }; }
      if (t===2) { const a=r(6,12),b=r(6,12); return { q:`${a} x ${b}`, a:a*b }; }
      const b=r(3,12),a=b*r(3,12); return { q:`${a} / ${b}`, a:a/b };
    },
    5: () => {
      const t=r(0,3);
      if (t===0) { const a=r(100,450),b=r(100,450); return { q:`${a} + ${b}`, a:a+b }; }
      if (t===1) { const a=r(150,500),b=r(50,a-50); return { q:`${a} - ${b}`, a:a-b }; }
      if (t===2) { const a=r(12,22),b=r(12,22); return { q:`${a} x ${b}`, a:a*b }; }
      const a=r(2,9),b=r(2,9),c=r(2,5); return { q:`(${a}+${b}) x ${c}`, a:(a+b)*c };
    },
    6: () => {
      const t=r(0,3);
      if (t===0) { const a=r(250,750),b=r(250,750); return { q:`${a} + ${b}`, a:a+b }; }
      if (t===1) { const x=r(10,65),n=r(5,35); return { q:`x + ${n} = ${x+n},  x = ?`, a:x }; }
      if (t===2) { const a=r(15,28),b=r(15,28); return { q:`${a} x ${b}`, a:a*b }; }
      const a=r(10,22),b=r(2,a-2),c=r(3,8); return { q:`(${a}-${b}) x ${c}`, a:(a-b)*c };
    },
  };
  return gens[level]();
}

const MATH_LEVEL_META = {
  1: { label: "Beginner",  icon: "🌱", color: "#10b981", bg: "#d1fae5" },
  2: { label: "Easy",      icon: "🌿", color: "#3b82f6", bg: "#dbeafe" },
  3: { label: "Medium",    icon: "🌸", color: "#8b5cf6", bg: "#ede9fe" },
  4: { label: "Hard",      icon: "🔥", color: "#f59e0b", bg: "#fef3c7" },
  5: { label: "Expert",    icon: "⚡", color: "#ef4444", bg: "#fee2e2" },
  6: { label: "Master",    icon: "🧠", color: "#7c3aed", bg: "#f3e8ff" },
};

// ─── Word Questions ───────────────────────────────────────────────────────────
const WORD_QUESTIONS = [
  { word: "Serene",    correct: "Peaceful",  options: ["Peaceful",  "Angry",     "Loud",      "Fast"]      },
  { word: "Tranquil",  correct: "Calm",      options: ["Excited",   "Calm",      "Rough",     "Dark"]      },
  { word: "Flourish",  correct: "Thrive",    options: ["Wither",    "Ignore",    "Thrive",    "Freeze"]    },
  { word: "Radiant",   correct: "Glowing",   options: ["Dull",      "Glowing",   "Hidden",    "Cold"]      },
  { word: "Nurture",   correct: "Care for",  options: ["Destroy",   "Avoid",     "Care for",  "Rush"]      },
  { word: "Bliss",     correct: "Happiness", options: ["Sadness",   "Anger",     "Confusion", "Happiness"] },
  { word: "Resilient", correct: "Tough",     options: ["Fragile",   "Tough",     "Quiet",     "Distant"]   },
  { word: "Zenith",    correct: "Peak",      options: ["Valley",    "Peak",      "Start",     "Silence"]   },
];

const PUZZLE_GRID = [1, 2, 3, 4, 5, 6, 7, 8, null];

// ─── Utilities ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function isSolved(t) { return t.every((v, i) => v === (i < 8 ? i + 1 : null)); }
function todayStr() { return new Date().toDateString(); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toDateString(); }

function generateMathOptions(q) {
  const opts = new Set([q.a]);
  let tries = 0;
  while (opts.size < 4 && tries++ < 60) {
    const spread = Math.max(3, Math.floor(q.a * 0.3));
    const v = q.a + r(-spread, spread);
    if (v !== q.a && v >= 0) opts.add(v);
  }
  return shuffle([...opts]);
}

// ─── SVG Garden Elements ──────────────────────────────────────────────────────
const Sparkle = ({ x, y, delay = 0, size = 14 }) => (
  <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
    transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 2 + Math.random() * 2 }}>
    <text x={x} y={y} fontSize={size} textAnchor="middle">✨</text>
  </motion.g>
);

const FloatingEmoji = ({ x, y, emoji, delay = 0 }) => (
  <motion.text x={x} y={y} fontSize="13" textAnchor="middle"
    animate={{ y: [y, y - 18, y], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}>
    {emoji}
  </motion.text>
);

const Butterfly = ({ startX, startY }) => {
  const path = `M${startX},${startY} Q${startX+70},${startY-50} ${startX+140},${startY} Q${startX+210},${startY+35} ${startX+280},${startY-25}`;
  return (
    <motion.text fontSize="15" initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
      style={{ offsetPath: `path('${path}')` }}>🦋</motion.text>
  );
};

const SmallPlant = ({ x, y, size = 1 }) => (
  <motion.g initial={{ scale: 0 }} animate={{ scale: size }}
    style={{ transformOrigin: `${x}px ${y}px` }}
    transition={{ type: "spring", stiffness: 120, damping: 10 }}>
    <ellipse cx={x} cy={y} rx={6} ry={3} fill="#6B7F3A" opacity="0.7" />
    <rect x={x-1} y={y-14} width={2} height={14} fill="#8B6914" rx={1} />
    <ellipse cx={x-5} cy={y-10} rx={5} ry={3} fill="#7DBF4A" transform={`rotate(-30 ${x-5} ${y-10})`} />
    <ellipse cx={x+5} cy={y-10} rx={5} ry={3} fill="#7DBF4A" transform={`rotate(30 ${x+5} ${y-10})`} />
    <ellipse cx={x} cy={y-14} rx={4} ry={3} fill="#90D45A" />
  </motion.g>
);

const TropicalPalm = ({ x, y }) => (
  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
    style={{ transformOrigin: `${x}px ${y}px` }}
    transition={{ type: "spring", stiffness: 70, damping: 12 }}>
    <rect x={x-3} y={y-40} width={6} height={40} fill="#A0522D" rx={3} />
    {[[-30,-45,"-20"],[30,-45,"20"],[0,-55,"0"],[-20,-50,"-10"],[20,-50,"10"]].map(([lx,ly,rot],i) => (
      <ellipse key={i} cx={x+lx} cy={y+ly} rx={16} ry={7} fill="#2E8B57"
        transform={`rotate(${rot} ${x+lx} ${y+ly})`} opacity={0.9} />
    ))}
    <circle cx={x-8} cy={y-38} r={4} fill="#DAA520" opacity={0.8} />
    <circle cx={x+6} cy={y-36} r={3.5} fill="#DAA520" opacity={0.8} />
  </motion.g>
);

const Flower = ({ x, y, color = "#FF9CC0", delay = 0 }) => (
  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 8, delay }}>
    <rect x={x-1} y={y-22} width={2} height={22} fill="#5F8B2C" rx={1} />
    {[0,60,120,180,240,300].map((deg, i) => (
      <motion.ellipse key={i}
        cx={x + Math.cos((deg*Math.PI)/180)*7} cy={y - 22 + Math.sin((deg*Math.PI)/180)*7}
        rx={4} ry={6} fill={color} opacity={0.85}
        transform={`rotate(${deg} ${x+Math.cos((deg*Math.PI)/180)*7} ${y-22+Math.sin((deg*Math.PI)/180)*7})`}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2+i*0.3, repeat: Infinity, ease: "easeInOut" }} />
    ))}
    <circle cx={x} cy={y-22} r={5} fill="#FFE566" />
  </motion.g>
);

const Tree = ({ x, y }) => (
  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
    style={{ transformOrigin: `${x}px ${y}px` }}
    transition={{ type: "spring", stiffness: 80, damping: 12 }}>
    <rect x={x-4} y={y-35} width={8} height={35} fill="#8B5E3C" rx={3} />
    <ellipse cx={x} cy={y-45} rx={22} ry={18} fill="#4A9E52" />
    <ellipse cx={x-10} cy={y-38} rx={14} ry={12} fill="#5CB85C" />
    <ellipse cx={x+10} cy={y-38} rx={14} ry={12} fill="#5CB85C" />
    <ellipse cx={x} cy={y-52} rx={12} ry={10} fill="#6FCF79" />
    <motion.text x={x-6} y={y-62} fontSize="10"
      animate={{ y: [y-62, y-68, y-62] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>🐦</motion.text>
  </motion.g>
);

const Cloud = ({ x, y, delay = 0 }) => (
  <motion.g animate={{ x: [0, 18, 0] }} transition={{ duration: 7+delay, repeat: Infinity, ease: "easeInOut", delay }}>
    <ellipse cx={x} cy={y} rx={30} ry={15} fill="white" opacity={0.7} />
    <ellipse cx={x-15} cy={y+5} rx={18} ry={12} fill="white" opacity={0.65} />
    <ellipse cx={x+15} cy={y+5} rx={20} ry={13} fill="white" opacity={0.65} />
  </motion.g>
);

const KoiPond = ({ x, y }) => (
  <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
    style={{ transformOrigin: `${x}px ${y}px` }}
    transition={{ type: "spring", stiffness: 60, damping: 12 }}>
    <ellipse cx={x} cy={y} rx={38} ry={16} fill="#60A5FA" opacity={0.5} />
    <ellipse cx={x} cy={y} rx={30} ry={11} fill="#3B82F6" opacity={0.3} />
    <motion.text x={x-10} y={y+4} fontSize="11"
      animate={{ x: [x-10, x+8, x-10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>🐠</motion.text>
    <motion.text x={x+5} y={y+6} fontSize="10"
      animate={{ x: [x+5, x-8, x+5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>🐟</motion.text>
  </motion.g>
);

// ─── Points Pop ───────────────────────────────────────────────────────────────
const PointsPop = ({ points, onDone }) => (
  <motion.div className="fixed z-50 pointer-events-none font-bold text-lg select-none"
    style={{ top: "28%", left: "50%", transform: "translateX(-50%)", color: "#16a34a" }}
    initial={{ opacity: 1, y: 0, scale: 0.8 }}
    animate={{ opacity: 0, y: -70, scale: 1.4 }}
    transition={{ duration: 1.3, ease: "easeOut" }}
    onAnimationComplete={onDone}>
    +{points} ⭐
  </motion.div>
);

// ─── Slide Puzzle ─────────────────────────────────────────────────────────────
function SlidePuzzle({ onSolved }) {
  const [tiles, setTiles] = useState(() => {
    let t; do { t = shuffle(PUZZLE_GRID); } while (isSolved(t)); return t;
  });
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  const move = (idx) => {
    if (done) return;
    const ei = tiles.indexOf(null);
    const row = i => Math.floor(i/3), col = i => i%3;
    if (Math.abs(row(idx)-row(ei)) + Math.abs(col(idx)-col(ei)) !== 1) return;
    const n = [...tiles]; [n[idx], n[ei]] = [n[ei], n[idx]];
    setTiles(n); setMoves(m => m+1);
    if (isSolved(n)) { setDone(true); setTimeout(onSolved, 500); }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-emerald-600 font-medium">Arrange tiles 1–8 in order ✨</p>
      <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(3,1fr)", width: 186 }}>
        {tiles.map((t, i) => (
          <motion.button key={i} whileTap={!done ? { scale: 0.9 } : {}} onClick={() => move(i)}
            className={`h-14 rounded-xl text-xl font-bold transition-all ${
              t === null ? "bg-transparent" : "bg-gradient-to-br from-emerald-200 to-teal-300 text-emerald-800 shadow-md hover:from-emerald-300 hover:to-teal-400"
            }`}>{t}</motion.button>
        ))}
      </div>
      <p className="text-xs text-gray-400">Moves: {moves}</p>
      {done && <motion.p initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
        className="text-emerald-600 font-semibold text-sm">Solved! 🌱</motion.p>}
    </div>
  );
}

// ─── Reward Store Modal ───────────────────────────────────────────────────────
function RewardStore({ points, unlocked, onBuy, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.35)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "linear-gradient(145deg,#f0fdf4,#eff6ff)", maxHeight: "85vh", overflowY: "auto" }}
        initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}>
        <div className="sticky top-0 px-6 pt-5 pb-3 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#d1fae5,#dbeafe)", zIndex: 1 }}>
          <div>
            <h2 className="text-xl font-bold text-emerald-800">🏪 Reward Store</h2>
            <p className="text-xs text-emerald-600 mt-0.5">Spend your stars to unlock garden magic</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold px-3 py-1 rounded-full"
              style={{ background: "rgba(251,191,36,0.25)", color: "#b45309" }}>⭐ {points} pts</span>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all">✕</button>
          </div>
        </div>
        <div className="px-5 pb-6 pt-2 grid gap-3">
          {STORE_ITEMS.map(item => {
            const owned = unlocked.includes(item.id);
            const canAfford = points >= item.cost;
            return (
              <motion.div key={item.id} className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: owned ? "rgba(209,250,229,0.6)" : "rgba(255,255,255,0.7)", border: owned ? "1.5px solid #6ee7b7" : "1.5px solid transparent" }}
                whileHover={!owned ? { scale: 1.01 } : {}}>
                <div className="text-3xl flex-shrink-0">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: "#f59e0b" }}>⭐ {item.cost} pts</p>
                </div>
                <div className="flex-shrink-0">
                  {owned ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Owned ✓</span>
                  ) : (
                    <motion.button whileTap={{ scale: 0.93 }} onClick={() => onBuy(item)}
                      disabled={!canAfford}
                      className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
                      style={{ background: canAfford ? "linear-gradient(135deg,#10b981,#059669)" : "#e5e7eb",
                               color: canAfford ? "white" : "#9ca3af",
                               cursor: canAfford ? "pointer" : "not-allowed" }}>
                      {canAfford ? "Unlock" : "Need ⭐"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Streak Milestone Popup ───────────────────────────────────────────────────
function MilestonePopup({ milestone, onClose }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="text-center p-8 rounded-3xl shadow-2xl max-w-xs w-full"
        style={{ background: "rgba(255,255,255,0.97)" }}
        initial={{ scale: 0.6, rotate: -5 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}>
        <motion.div className="text-6xl mb-3"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}>{milestone.emoji}</motion.div>
        <h2 className="text-2xl font-bold text-amber-600">{milestone.label}!</h2>
        <p className="text-gray-500 mt-1 text-sm">🔥 {milestone.days}-Day Streak Achieved!</p>
        <motion.p className="mt-3 text-2xl font-bold text-emerald-600"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
          +{milestone.bonus} ⭐
        </motion.p>
        <p className="text-xs text-gray-400 mt-1">Bonus points added to your balance</p>
        <button onClick={onClose}
          className="mt-5 px-8 py-2.5 rounded-xl text-white text-sm font-bold shadow"
          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
          Awesome! 🎉
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MindGarden() {

  const DEFAULT = {
    score: 0, plants: [], flowers: [], gratitudes: [],
    plays: {}, completedSlots: [], lastDate: todayStr(),
    streak: 0, streakAwardedDate: "",
    rewardPoints: 0, unlockedRewards: [],
    dailyBonusAwarded: false, milestonesAwarded: [],
    totalDays: 1,   // increments each day the user opens the game
  };

  const initState = () => {
    let s;
    try { s = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch {}
    if (!s || typeof s.score !== "number") return { ...DEFAULT };
    s = { ...DEFAULT, ...s };
    if (s.lastDate !== todayStr()) {
      const awardedYesterday = s.streakAwardedDate === yesterdayStr();
      s = {
        ...s,
        plays: {}, completedSlots: [], lastDate: todayStr(),
        streak: awardedYesterday ? s.streak : 0,
        dailyBonusAwarded: false,
        totalDays: (s.totalDays || 1) + 1,  // new day = level up!
      };
    }
    return s;
  };

  const [state, setState] = useState(initState);
  const [activePanel, setActivePanel] = useState(null);
  const [showStore, setShowStore] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pointsPop, setPointsPop] = useState(null);
  const [celebration, setCelebration] = useState(false);
  const [milestonePopup, setMilestonePopup] = useState(null);
  const [mathQ, setMathQ] = useState(() => generateMathQuestion(getMathLevel(1)));
  const [wordQ, setWordQ] = useState(() => WORD_QUESTIONS[r(0, WORD_QUESTIONS.length-1)]);
  const [gratitudeText, setGratitudeText] = useState("");
  const milestoneQueue = useRef([]);

  // Derived math level from total days
  const mathLevel = getMathLevel(state.totalDays || 1);
  const mathMeta = MATH_LEVEL_META[mathLevel];

  // Persist + side effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const slots = state.completedSlots || [];
    const allDone = slots.length >= TOTAL_ACTIVITIES;

    if (allDone && state.streakAwardedDate !== todayStr()) {
      const prevDate = state.streakAwardedDate || "";
      const consecutive = prevDate === yesterdayStr();
      const newStreak = consecutive ? state.streak + 1 : 1;
      const bonusPts = state.dailyBonusAwarded ? 0 : POINTS.ALL_COMPLETE_BONUS;
      const alreadyAwarded = state.milestonesAwarded || [];
      const hit = STREAK_MILESTONES.find(m => m.days === newStreak && !alreadyAwarded.includes(m.days));

      setState(s => ({
        ...s,
        streak: newStreak, streakAwardedDate: todayStr(),
        rewardPoints: s.rewardPoints + bonusPts + (hit ? hit.bonus : 0),
        dailyBonusAwarded: true,
        milestonesAwarded: hit ? [...alreadyAwarded, hit.days] : alreadyAwarded,
      }));
      if (bonusPts > 0) setPointsPop(bonusPts + (hit ? hit.bonus : 0));
      if (hit) milestoneQueue.current.push(hit);
      if (!celebration) setCelebration(true);
      return;
    }
    if (allDone && !celebration) setCelebration(true);
    if (milestoneQueue.current.length > 0 && !milestonePopup) {
      const next = milestoneQueue.current.shift();
      setTimeout(() => setMilestonePopup(next), 1800);
    }
  }, [state]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const addPoints = useCallback((pts) => {
    setState(s => ({ ...s, rewardPoints: s.rewardPoints + pts }));
    setPointsPop(pts);
  }, []);

  const recordPlay = useCallback((key) => {
    setState(s => {
      const newPlays = { ...(s.plays||{}), [key]: ((s.plays||{})[key] ?? 0) + 1 };
      const slots = s.completedSlots || [];
      const newSlots = slots.length < TOTAL_ACTIVITIES ? [...slots, `${key}_${newPlays[key]}`] : slots;
      return { ...s, plays: newPlays, completedSlots: newSlots };
    });
  }, []);

  const doGrowPlant = useCallback(() => {
    const xs = [70,140,210,290,360,440,510];
    const x = xs[r(0, xs.length-1)] + r(-12, 12);
    setState(s => ({ ...s, plants: [...s.plants, { x, id: Date.now() }], score: s.score+1 }));
  }, []);

  const doGrowTwoPlants = useCallback(() => {
    const xs = [70,140,210,290,360,440,510];
    const x1 = xs[r(0,xs.length-1)] + r(-12,12), x2 = xs[r(0,xs.length-1)] + r(-12,12);
    setState(s => ({ ...s, plants: [...s.plants, {x:x1,id:Date.now()}, {x:x2,id:Date.now()+1}], score: s.score+2 }));
  }, []);

  const doGrowFlower = useCallback(() => {
    const colors = ["#FF9CC0","#C084FC","#60A5FA","#F97316","#FBBF24","#86EFAC","#F472B6"];
    setState(s => ({
      ...s,
      flowers: [...s.flowers, { x: 55+Math.random()*490, color: colors[r(0,colors.length-1)], id: Date.now(), delay: Math.random()*0.4 }],
      score: s.score+1
    }));
  }, []);

  const showFeedback = (msg, good) => { setFeedback({ msg, good }); setTimeout(() => setFeedback(null), 2500); };
  const pickMath = useCallback(() => setMathQ(generateMathQuestion(mathLevel)), [mathLevel]);
  const pickWord = () => setWordQ(WORD_QUESTIONS[r(0, WORD_QUESTIONS.length-1)]);

  const playsFor = (key) => (state.plays||{})[key] ?? 0;
  const isGardenFull = (state.completedSlots||[]).length >= TOTAL_ACTIVITIES;
  const isLocked = (key) => isGardenFull || playsFor(key) >= MAX_PLAYS_PER_GAME;
  const progress = (state.completedSlots||[]).length;
  const progressPct = Math.min((progress/TOTAL_ACTIVITIES)*100, 100);
  const unlocked = state.unlockedRewards || [];
  const hasButterfly = unlocked.includes("butterfly");
  const hasCalmTheme = unlocked.includes("calm_theme");
  const hasFireflies = unlocked.includes("fireflies");
  const hasRainbow = unlocked.includes("rainbow");
  const hasKoiPond = unlocked.includes("koi_pond");
  const hasExtraPlant = unlocked.includes("extra_plant");
  const streakFlames = state.streak >= 30 ? "👑" : state.streak >= 15 ? "🌟🔥" : state.streak >= 7 ? "🔥🔥" : state.streak >= 1 ? "🔥" : "❄️";

  const openPanel = (key) => {
    if (isGardenFull) { showFeedback("🌙 Garden complete! Come back tomorrow", false); return; }
    if (playsFor(key) >= MAX_PLAYS_PER_GAME) { showFeedback(`You've played this ${MAX_PLAYS_PER_GAME}x today 🌿`, false); return; }
    if (key === "math") pickMath();
    if (key === "word") pickWord();
    setActivePanel(prev => prev === key ? null : key);
  };

  const handleBuy = (item) => {
    if (state.rewardPoints < item.cost || unlocked.includes(item.id)) return;
    setState(s => ({ ...s, rewardPoints: s.rewardPoints - item.cost, unlockedRewards: [...(s.unlockedRewards||[]), item.id] }));
    showFeedback(`${item.emoji} ${item.name} unlocked!`, true);
  };

  const ACTIVITIES = [
    { key:"puzzle",    label:"Solve Puzzle",   emoji:"🧩", color:"from-teal-200 to-cyan-300"     },
    { key:"gratitude", label:"Write Gratitude", emoji:"🌸", color:"from-pink-200 to-rose-300"     },
    { key:"math",      label:"Solve Math",      emoji:"🔢", color:"from-violet-200 to-purple-300" },
    { key:"word",      label:"Word Meaning",    emoji:"📖", color:"from-amber-200 to-yellow-300"  },
  ];

  const skyTop = hasCalmTheme ? "#fde68a" : "#bde0fe";
  const skyBot = hasCalmTheme ? "#fed7aa" : "#daf5e7";

  return (
    <div className="min-h-screen" style={{
      background: hasCalmTheme
        ? "linear-gradient(160deg,#fef3c7 0%,#fde68a 40%,#fed7aa 100%)"
        : "linear-gradient(160deg,#d4f5e9 0%,#e8f4fd 40%,#f0e8ff 100%)",
      fontFamily: "'Nunito', sans-serif", transition: "background 1s ease"
    }}>

      {/* Points Pop */}
      <AnimatePresence>
        {pointsPop && <PointsPop points={pointsPop} onDone={() => setPointsPop(null)} />}
      </AnimatePresence>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold"
            style={{ background: feedback.good?"#d8f3dc":"#fff3cd", color: feedback.good?"#1b4332":"#856404", maxWidth:"90vw", textAlign:"center", zIndex: 60 }}>
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>{showStore && <RewardStore points={state.rewardPoints} unlocked={unlocked} onBuy={handleBuy} onClose={() => setShowStore(false)} />}</AnimatePresence>
      <AnimatePresence>{milestonePopup && <MilestonePopup milestone={milestonePopup} onClose={() => setMilestonePopup(null)} />}</AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {celebration && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background:"rgba(0,0,0,0.2)" }}>
            <motion.div className="text-center p-8 rounded-3xl shadow-2xl mx-4 max-w-xs w-full"
              style={{ background:"rgba(255,255,255,0.97)" }}
              initial={{ scale:0.7 }} animate={{ scale:1 }} transition={{ type:"spring" }}>
              <motion.div className="text-5xl mb-2"
                animate={{ rotate:[0,12,-12,0] }} transition={{ duration:0.7, delay:0.2 }}>🌳✨🌸</motion.div>
              <h2 className="text-xl font-bold text-emerald-700">Great work!</h2>
              <p className="text-sm text-gray-500 mt-1">Your garden is growing 🌱</p>
              <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">🔥 {state.streak}-day streak</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">⭐ {state.rewardPoints} pts</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Activities locked until tomorrow 🌙</p>
              <button onClick={() => setCelebration(false)}
                className="mt-4 px-7 py-2.5 rounded-xl text-white text-sm font-bold shadow"
                style={{ background:"linear-gradient(135deg,#10b981,#059669)" }}>
                View Garden 🌿
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center pt-7 pb-1 px-4">
        <motion.h1 initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }}
          className="text-4xl font-bold" style={{ color: hasCalmTheme?"#92400e":"#2d6a4f", letterSpacing:"-0.5px" }}>
          🌿 Mind Garden
        </motion.h1>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1, transition:{ delay:0.3 } }}
          className="text-sm mt-0.5" style={{ color: hasCalmTheme?"#b45309":"#52b788" }}>
          Your peaceful digital wellness space · AROGYAM
        </motion.p>
      </div>

      {/* Top Dashboard Bar */}
      <div className="max-w-xl mx-auto px-4 mt-4">
        <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
          className="rounded-2xl px-5 py-3 flex items-center justify-between shadow-md"
          style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(10px)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{streakFlames}</span>
            <div>
              <p className="text-xs text-gray-400 leading-tight">Streak</p>
              <p className="text-base font-bold leading-tight" style={{ color: state.streak>0?"#c2410c":"#3b82f6" }}>
                {state.streak} {state.streak===1?"Day":"Days"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 leading-tight text-right">Points</p>
            <motion.p className="text-base font-bold text-amber-600 leading-tight"
              key={state.rewardPoints} animate={{ scale:[1,1.2,1] }} transition={{ duration:0.3 }}>
              ⭐ {state.rewardPoints}
            </motion.p>
          </div>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={() => setShowStore(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow"
            style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            🏪 Store
          </motion.button>
        </motion.div>
      </div>

      {/* Progress Card */}
      <div className="max-w-xl mx-auto px-4 mt-3">
        <div className="rounded-2xl p-4 shadow-sm" style={{ background:"rgba(255,255,255,0.62)", backdropFilter:"blur(8px)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: hasCalmTheme?"#92400e":"#065f46" }}>🌱 Today's Wellness Growth</span>
            <span className="text-xs text-gray-400">{progress} / {TOTAL_ACTIVITIES} activities</span>
          </div>
          <div className="h-3 rounded-full bg-emerald-100 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: hasCalmTheme?"linear-gradient(90deg,#f59e0b,#fbbf24)":"linear-gradient(90deg,#52b788,#95d5b2)" }}
              initial={{ width:0 }} animate={{ width:`${progressPct}%` }} transition={{ duration:0.7, ease:"easeOut" }} />
          </div>
          <div className="flex gap-1.5 mt-2 justify-center">
            {Array.from({ length: TOTAL_ACTIVITIES }).map((_,i) => (
              <motion.div key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: i<progress?"#52b788":"#d8f3dc", color: i<progress?"white":"#74c69d" }}
                animate={{ scale: i===progress-1?[1,1.4,1]:1 }} transition={{ duration:0.35 }}>
                {i<progress?"✓":i+1}
              </motion.div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 justify-center flex-wrap">
            {ACTIVITIES.map(({ key, emoji }) => {
              const p = playsFor(key);
              return (
                <div key={key} className="flex items-center gap-1 text-xs">
                  <span>{emoji}</span>
                  <span className={p>=MAX_PLAYS_PER_GAME?"text-rose-400 font-bold":"text-gray-400"}>
                    {p}/{MAX_PLAYS_PER_GAME}
                  </span>
                </div>
              );
            })}
          </div>
          {isGardenFull && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="text-center text-xs font-semibold mt-2 text-emerald-700">
              🌙 Garden complete! See you tomorrow.
            </motion.p>
          )}
        </div>
      </div>

      {/* Streak Milestone Hints */}
      {state.streak > 0 && !STREAK_MILESTONES.every(m => (state.milestonesAwarded||[]).includes(m.days)) && (
        <div className="max-w-xl mx-auto px-4 mt-2">
          <div className="rounded-xl px-4 py-2 flex gap-3 overflow-x-auto" style={{ background:"rgba(255,255,255,0.45)" }}>
            {STREAK_MILESTONES.filter(m => !(state.milestonesAwarded||[]).includes(m.days)).map(m => (
              <div key={m.days} className="flex items-center gap-1.5 flex-shrink-0 text-xs text-gray-500">
                <span>{m.emoji}</span>
                <span>{m.days}d <span className="font-bold text-amber-600">+{m.bonus}⭐</span></span>
                {state.streak >= m.days-3 && state.streak < m.days && (
                  <span className="text-emerald-500 font-semibold">({m.days-state.streak} more!)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garden SVG */}
      <div className="max-w-3xl mx-auto px-4 mt-3">
        <motion.div className="rounded-3xl overflow-hidden shadow-lg"
          style={{ background:"rgba(255,255,255,0.38)", backdropFilter:"blur(6px)" }}>
          <svg viewBox="0 0 620 270" width="100%" style={{ display:"block" }}>
            <defs>
              <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={skyTop}/><stop offset="100%" stopColor={skyBot}/>
              </linearGradient>
              <linearGradient id="soil2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B6914"/><stop offset="100%" stopColor="#6B4F12"/>
              </linearGradient>
              {hasRainbow && (
                <linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="0">
                  {["#ff0000","#ff7700","#ffff00","#00ff00","#0000ff","#8b00ff"].map((c,i) => (
                    <stop key={i} offset={`${i*20}%`} stopColor={c} stopOpacity="0.45"/>
                  ))}
                </linearGradient>
              )}
            </defs>
            <rect width="620" height="270" fill="url(#sky2)" />
            {hasRainbow && (
              <motion.path d="M 30 230 Q 310 60 590 230" fill="none" stroke="url(#rainbowGrad)" strokeWidth="14"
                initial={{ pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:1 }}
                transition={{ duration:2, ease:"easeOut" }} />
            )}
            <motion.circle cx="560" cy="45" r={hasCalmTheme?32:28} fill={hasCalmTheme?"#FBBF24":"#FFD54F"} opacity="0.9"
              animate={{ r: hasCalmTheme?[32,35,32]:[28,31,28] }} transition={{ duration:4, repeat:Infinity }} />
            <motion.circle cx="560" cy="45" r={hasCalmTheme?42:37} fill={hasCalmTheme?"#FDE68A":"#FFD54F"} opacity="0.25"
              animate={{ r: hasCalmTheme?[42,46,42]:[37,41,37] }} transition={{ duration:4, repeat:Infinity }} />
            <Cloud x={100} y={42} delay={0}/><Cloud x={300} y={30} delay={2}/><Cloud x={460} y={55} delay={1}/>
            {state.streak >= 3 && (
              <text x={28} y={28} fontSize="11" fill={hasCalmTheme?"#92400e":"#f59e0b"} fontWeight="bold">
                {streakFlames} {state.streak}-day streak!
              </text>
            )}
            {hasFireflies && [100,200,310,420,520].map((fx,i) => (
              <FloatingEmoji key={fx} x={fx} y={80+i*15} emoji="🌟" delay={i*0.7} />
            ))}
            {(hasButterfly || state.flowers.length > 0) && <Butterfly startX={20} startY={115}/>}
            {(hasButterfly || state.score > 4) && <Butterfly startX={160} startY={88}/>}
            {hasButterfly && <Butterfly startX={350} startY={100}/>}
            <ellipse cx={310} cy={218} rx={312} ry={32} fill="#74c69d" opacity="0.5"/>
            <rect x={0} y={218} width={620} height={52} fill="url(#soil2)"/>
            {[40,120,200,300,400,500,580].map(x => (
              <ellipse key={x} cx={x} cy={223} rx={18} ry={5} fill="#A0762A" opacity="0.3"/>
            ))}
            {hasKoiPond && <KoiPond x={310} y={230}/>}
            {state.score >= 6  && <Tree x={80}  y={218}/>}
            {state.score >= 10 && <Tree x={540} y={218}/>}
            {state.score >= 16 && <Tree x={310} y={218}/>}
            {hasExtraPlant && <TropicalPalm x={170} y={218}/>}
            {state.flowers.map(f => (
              <Flower key={f.id} x={Math.min(Math.max(f.x,42),578)} y={218} color={f.color} delay={f.delay}/>
            ))}
            {state.plants.map((p,i) => (
              <SmallPlant key={p.id} x={Math.min(Math.max(p.x,30),590)} y={218} size={Math.min(1+i*0.05,1.65)}/>
            ))}
            {celebration && [70,160,260,370,460,560].map((x,i) => (
              <Sparkle key={x} x={x} y={105+(i%2)*40} delay={i*0.22} size={16}/>
            ))}
            {state.plants.length===0 && state.flowers.length===0 && (
              <text x={310} y={192} textAnchor="middle" fill="#74c69d" fontSize="13" opacity="0.8">
                Complete activities to grow your garden 🌱
              </text>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Activity Buttons */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIVITIES.map(({ key, label, emoji, color }) => {
            const locked = isLocked(key);
            const plays = playsFor(key);
            return (
              <motion.button key={key}
                whileHover={!locked?{ scale:1.04 }:{}} whileTap={!locked?{ scale:0.96 }:{}}
                onClick={() => openPanel(key)}
                className={`relative rounded-2xl p-3 text-center shadow-md bg-gradient-to-br ${color} transition-all ${locked?"opacity-50 cursor-not-allowed grayscale":"cursor-pointer"}`}>
                <div className="text-2xl mb-0.5">{locked?"🔒":emoji}</div>
                <div className="text-xs font-semibold text-gray-700">{label}</div>

                <div className="text-xs mt-0.5" style={{ color: plays>=MAX_PLAYS_PER_GAME?"#f43f5e":"#9ca3af" }}>
                  {plays}/{MAX_PLAYS_PER_GAME}
                </div>
                {plays>=MAX_PLAYS_PER_GAME && <span className="absolute top-1 right-2 text-xs">✅</span>}
              </motion.button>
            );
          })}
        </div>
        {isGardenFull && (
          <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }}
            className="mt-3 text-center rounded-2xl py-2.5 px-4 text-sm font-medium text-emerald-800"
            style={{ background:"rgba(209,250,229,0.8)" }}>
            🌙 All 5 activities done! Garden rests until tomorrow.
          </motion.div>
        )}
      </div>

      {/* Active Panel */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          {activePanel && !isGardenFull && (
            <motion.div key={activePanel}
              initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }}
              transition={{ duration:0.3 }}
              className="mt-3 rounded-3xl p-5 shadow-lg"
              style={{ background:"rgba(255,255,255,0.82)", backdropFilter:"blur(12px)" }}>

              {/* Puzzle */}
              {activePanel==="puzzle" && (
                <div>
                  <h3 className="text-center font-bold text-teal-700 mb-1">🧩 Calm Puzzle</h3>
                  <p className="text-center text-xs text-amber-600 font-medium mb-3">Solve to earn +{POINTS.PUZZLE_SOLVE + POINTS.ACTIVITY_COMPLETE} ⭐</p>
                  <SlidePuzzle onSolved={() => {
                    doGrowTwoPlants();
                    recordPlay("puzzle");
                    addPoints(POINTS.PUZZLE_SOLVE + POINTS.ACTIVITY_COMPLETE);
                    showFeedback(`Solved! +${POINTS.PUZZLE_SOLVE + POINTS.ACTIVITY_COMPLETE} ⭐ 🌱`, true);
                    setTimeout(() => setActivePanel(null), 1200);
                  }} />
                  <p className="text-center text-xs text-gray-300 mt-2">Plays remaining: {MAX_PLAYS_PER_GAME - playsFor("puzzle")}</p>
                </div>
              )}

              {/* Gratitude */}
              {activePanel==="gratitude" && (
                <div>
                  <h3 className="text-center font-bold text-rose-600 mb-1">🌸 Reflection Moment</h3>
                  <p className="text-center text-xs text-amber-600 font-medium mb-1">Share a thought → earn +{POINTS.ACTIVITY_COMPLETE} ⭐</p>
                  <p className="text-center text-xs text-gray-300 mb-3">Plays remaining: {MAX_PLAYS_PER_GAME - playsFor("gratitude")}</p>
                  <textarea value={gratitudeText} onChange={e=>setGratitudeText(e.target.value)}
                    placeholder="I am grateful for..." rows={3}
                    className="w-full rounded-xl border border-pink-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ background:"rgba(255,255,255,0.88)" }} />
                  <motion.button whileTap={{ scale:0.95 }}
                    onClick={() => {
                      if (gratitudeText.trim().length < 3) { showFeedback("Please write a bit more 🌿", false); return; }
                      doGrowFlower();
                      recordPlay("gratitude");
                      addPoints(POINTS.ACTIVITY_COMPLETE);
                      setState(s => ({ ...s, gratitudes:[...s.gratitudes,{ text:gratitudeText, date:todayStr() }] }));
                      setGratitudeText("");
                      showFeedback(`Beautiful! +${POINTS.ACTIVITY_COMPLETE} ⭐ · A flower bloomed 🌸`, true);
                      setTimeout(() => setActivePanel(null), 1200);
                    }}
                    className="mt-3 w-full py-2 rounded-xl font-semibold text-sm text-white"
                    style={{ background:"linear-gradient(135deg,#f9a8d4,#ec4899)" }}>
                    Plant My Gratitude 🌸
                  </motion.button>
                  {state.gratitudes.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-400 mb-1">Recent thoughts:</p>
                      <div className="max-h-20 overflow-y-auto space-y-1">
                        {state.gratitudes.slice(-3).reverse().map((g,i) => (
                          <p key={i} className="text-xs text-gray-500 bg-pink-50 rounded-lg px-2 py-1">"{g.text}"</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Math */}
              {activePanel==="math" && (
                <div>
                  <h3 className="text-center font-bold text-violet-700 mb-1">🔢 Math Challenge</h3>

                  {/* Level badge */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: mathMeta.bg, color: mathMeta.color }}>
                      {mathMeta.icon} Level {mathLevel} · {mathMeta.label}
                    </span>
                    <span className="text-xs text-gray-400">Day {state.totalDays}</span>
                  </div>

                  {/* Level progress bar */}
                  <div className="mb-3 px-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Lv {mathLevel}</span>
                      <span>{mathLevel < 6 ? `Lv ${mathLevel+1} unlocks day ${[4,8,15,22,30][mathLevel-1]}` : "Max Level!"}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: mathMeta.color, width: `${Math.min(((state.totalDays - [1,4,8,15,22,30][mathLevel-1]) / ([3,4,7,7,8,Infinity][mathLevel-1])) * 100, 100)}%` }}
                        initial={{ width:0 }} animate={{ width: `${Math.min(((state.totalDays - [1,4,8,15,22,30][mathLevel-1]) / ([3,4,7,7,8,999][mathLevel-1])) * 100, 100)}%` }}
                        transition={{ duration:0.6 }} />
                    </div>
                  </div>

                  <p className="text-center text-xs text-amber-600 font-medium mb-1">Correct → +{POINTS.ACTIVITY_COMPLETE + POINTS.CORRECT_ANSWER} ⭐</p>
                  <p className="text-center text-xs text-gray-300 mb-4">Plays: {playsFor("math")}/{MAX_PLAYS_PER_GAME} · Wrong answers don't cost a play</p>

                  <div className="text-center mb-5">
                    <span className="text-3xl font-bold text-violet-700">{mathQ.q} = ?</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {generateMathOptions(mathQ).map((opt,i) => (
                      <motion.button key={i} whileHover={{ scale:1.04 }} whileTap={{ scale:0.94 }}
                        onClick={() => {
                          if (opt === mathQ.a) {
                            doGrowPlant();
                            recordPlay("math");
                            addPoints(POINTS.ACTIVITY_COMPLETE + POINTS.CORRECT_ANSWER);
                            showFeedback(`Correct! +${POINTS.ACTIVITY_COMPLETE+POINTS.CORRECT_ANSWER} ⭐ 🌱`, true);
                            setTimeout(() => { setActivePanel(null); pickMath(); }, 1000);
                          } else {
                            showFeedback("Not quite — try again 🌿 (no points lost)", false);
                            pickMath();
                          }
                        }}
                        className="py-3 rounded-xl text-lg font-bold text-violet-800"
                        style={{ background:"linear-gradient(135deg,#ede9fe,#c4b5fd)" }}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Word */}
              {activePanel==="word" && (
                <div>
                  <h3 className="text-center font-bold text-amber-700 mb-1">📖 Word Meaning</h3>
                  <p className="text-center text-xs text-amber-600 font-medium mb-1">Correct → +{POINTS.ACTIVITY_COMPLETE + POINTS.CORRECT_ANSWER} ⭐</p>
                  <p className="text-center text-xs text-gray-300 mb-3">Plays: {playsFor("word")}/{MAX_PLAYS_PER_GAME} · Wrong answers don't cost a play</p>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-amber-700 italic">{wordQ.word}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {wordQ.options.map((opt,i) => (
                      <motion.button key={i} whileHover={{ scale:1.04 }} whileTap={{ scale:0.94 }}
                        onClick={() => {
                          if (opt === wordQ.correct) {
                            doGrowFlower();
                            recordPlay("word");
                            addPoints(POINTS.ACTIVITY_COMPLETE + POINTS.CORRECT_ANSWER);
                            showFeedback(`Brilliant! +${POINTS.ACTIVITY_COMPLETE+POINTS.CORRECT_ANSWER} ⭐ 🌸`, true);
                            setTimeout(() => { setActivePanel(null); pickWord(); }, 1000);
                          } else {
                            showFeedback("Not quite 🌿 (no points lost)", false);
                            pickWord();
                          }
                        }}
                        className="py-3 rounded-xl text-sm font-semibold text-amber-900"
                        style={{ background:"linear-gradient(135deg,#fef3c7,#fcd34d)" }}>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <div className="rounded-2xl px-4 py-3 flex justify-around text-xs text-gray-500"
          style={{ background:"rgba(255,255,255,0.5)" }}>
          <span>🌱 {state.plants.length} plants</span>
          <span>🌸 {state.flowers.length} flowers</span>
          <span>⭐ {state.rewardPoints} pts</span>
          <span>🔥 {state.streak}d streak</span>
          <span>📅 Day {state.totalDays}</span>
        </div>
      </div>

    </div>
  );
}
