import { useState, useEffect, useRef, useCallback } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const TOTAL_CYCLES = 10;
const INHALE_SECS = 4;
const HOLD_SECS = 4;
const EXHALE_SECS = 6;
const CYCLE_DURATION = INHALE_SECS + HOLD_SECS + EXHALE_SECS;

const PHASES = [
  { name: "Inhale",  duration: INHALE_SECS,  rStart: 0, rEnd: 1,   color: "#7DECA1", glow: "rgba(125,236,161,0.35)" },
  { name: "Hold",    duration: HOLD_SECS,    rStart: 1, rEnd: 1,   color: "#FFD97D", glow: "rgba(255,217,125,0.35)" },
  { name: "Exhale",  duration: EXHALE_SECS,  rStart: 1, rEnd: 0,   color: "#7EC8FF", glow: "rgba(126,200,255,0.35)" },
];

const SCREEN = { START: "start", GAME: "game", END: "end" };

// ── Star field ────────────────────────────────────────────────────────────────
function generateStars(count = 130) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.15,
      twinkleDuration: Math.random() * 3 + 2,
      twinkleDelay: Math.random() * 4,
    });
  }
  return stars;
}
const STARS = generateStars();

// ── useLocalStorage streak hook ───────────────────────────────────────────────
function useStreak() {
  const load = () => {
    try {
      const raw = localStorage.getItem("arogyam_streak");
      if (!raw) return { count: 0, lastDate: null, bestStreak: 0, totalSessions: 0 };
      return JSON.parse(raw);
    } catch { return { count: 0, lastDate: null, bestStreak: 0, totalSessions: 0 }; }
  };

  const [streak, setStreak] = useState(load);

  const markSessionComplete = useCallback(() => {
    const today = new Date().toDateString();
    setStreak(prev => {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newCount = 1;
      if (prev.lastDate === today) {
        newCount = prev.count; // already done today
      } else if (prev.lastDate === yesterday) {
        newCount = prev.count + 1;
      }
      const updated = {
        count: newCount,
        lastDate: today,
        bestStreak: Math.max(prev.bestStreak, newCount),
        totalSessions: prev.totalSessions + 1,
      };
      try { localStorage.setItem("arogyam_streak", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return { streak, markSessionComplete };
}

// ── Circular SVG arc helper ───────────────────────────────────────────────────
function Arc({ progress, color, radius, strokeWidth = 5 }) {
  const cx = 50, cy = 50;
  const r = radius;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);
  return (
    <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.5s ease" }}
      />
    </svg>
  );
}

// ── Breathing Circle ──────────────────────────────────────────────────────────
function BreathingCircle({ scale, phase, idle = false }) {
  const phaseData = PHASES.find(p => p.name === phase) || PHASES[0];
  const color = phaseData.color;
  const glow = phaseData.glow;

  const baseSize = 200;
  const minScale = 0.5;
  const maxScale = 1;
  const actualScale = minScale + (maxScale - minScale) * scale;
  const size = baseSize * actualScale;

  return (
    <div style={{
      width: baseSize, height: baseSize,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {/* Outer glow rings */}
      {[1.8, 1.5, 1.2].map((mult, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size * mult, height: size * mult,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          opacity: (0.4 - i * 0.12) * actualScale,
          transition: "all 0.05s linear",
        }} />
      ))}

      {/* Main sphere */}
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%,
          rgba(255,255,255,0.45) 0%,
          ${color}cc 30%,
          ${color}88 60%,
          ${color}44 100%)`,
        boxShadow: `0 0 ${40 * actualScale}px ${glow}, 0 0 ${80 * actualScale}px ${glow}`,
        transition: "all 0.05s linear",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Inner shimmer */}
        <div style={{
          position: "absolute",
          top: "12%", left: "15%",
          width: "35%", height: "35%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          filter: "blur(6px)",
        }} />
      </div>
    </div>
  );
}

// ── Streak Badge ──────────────────────────────────────────────────────────────
function StreakBadge({ count, best }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "center",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 16, padding: "8px 18px",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>🔥</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>streak</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#FFD97D", lineHeight: 1 }}>{count}</div>
      </div>
      {best > 1 && (
        <>
          <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.1)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, lineHeight: 1 }}>🏆</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>best</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#c084fc", lineHeight: 1 }}>{best}</div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#7EC8FF" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${color}33`,
      borderRadius: 16, padding: "16px 24px",
      textAlign: "center", minWidth: 100,
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ── Stars Background ──────────────────────────────────────────────────────────
function StarField() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:var(--op-lo)} 50%{opacity:var(--op-hi)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes breathePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes countdownRing { from{stroke-dashoffset:283} to{stroke-dashoffset:0} }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
      {STARS.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: "#fff",
          "--op-lo": s.opacity * 0.3,
          "--op-hi": s.opacity,
          animation: `twinkle ${s.twinkleDuration}s ${s.twinkleDelay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Phase Dots (cycle indicator) ──────────────────────────────────────────────
function CycleDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 280 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: i < current ? "#7DECA1" : "rgba(255,255,255,0.12)",
          boxShadow: i < current ? "0 0 8px #7DECA177" : "none",
          transition: "all 0.4s ease",
        }} />
      ))}
    </div>
  );
}

// ── START SCREEN ──────────────────────────────────────────────────────────────
function StartScreen({ onStart, streak }) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => p + 0.05), 50);
    return () => clearInterval(id);
  }, []);

  const idleScale = 0.5 + 0.15 * ((Math.sin(pulse) + 1) / 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, animation: "fadeInUp 0.8s ease" }}>
      {/* Logo / Title */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          fontSize: 11, letterSpacing: 6, color: "rgba(255,255,255,0.35)",
          fontFamily: "'DM Mono', monospace", marginBottom: 12, textTransform: "uppercase"
        }}>Arogyam presents</div>
        <h1 style={{
          fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 800, margin: 0, lineHeight: 1,
          fontFamily: "'Space Grotesk', sans-serif",
          background: "linear-gradient(135deg, #7DECA1 0%, #7EC8FF 50%, #c084fc 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>Breathe</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, margin: "10px 0 0", fontWeight: 300, letterSpacing: 1 }}>
          Rhythm Trainer
        </p>
      </div>

      {/* Idle circle */}
      <div style={{ position: "relative", width: 200, height: 200, marginBottom: 36 }}>
        <BreathingCircle scale={idleScale} phase="Inhale" idle />
        <div style={{
          position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
          fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 2,
          fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap"
        }}>INHALE • HOLD • EXHALE</div>
      </div>

      {/* Streak */}
      {streak.count > 0 && (
        <div style={{ marginBottom: 28 }}>
          <StreakBadge count={streak.count} best={streak.bestStreak} />
        </div>
      )}

      {/* Session info */}
      <div style={{
        display: "flex", gap: 12, marginBottom: 36,
        flexWrap: "wrap", justifyContent: "center"
      }}>
        {[
          { label: "Inhale", value: `${INHALE_SECS}s`, color: "#7DECA1" },
          { label: "Hold",   value: `${HOLD_SECS}s`,   color: "#FFD97D" },
          { label: "Exhale", value: `${EXHALE_SECS}s`, color: "#7EC8FF" },
          { label: "Cycles", value: `${TOTAL_CYCLES}`, color: "#c084fc" },
        ].map(s => (
          <div key={s.label} style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${s.color}33`,
            borderRadius: 12, padding: "10px 16px",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        style={{
          padding: "16px 56px", borderRadius: 50, border: "none", cursor: "pointer",
          fontSize: 17, fontWeight: 700, letterSpacing: 1.5,
          fontFamily: "'Space Grotesk', sans-serif",
          background: "linear-gradient(135deg, #7DECA1, #7EC8FF)",
          color: "#0a1628",
          boxShadow: "0 0 40px rgba(125,236,161,0.4), 0 4px 20px rgba(0,0,0,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
          textTransform: "uppercase",
        }}
        onMouseEnter={e => { e.target.style.transform = "scale(1.06)"; e.target.style.boxShadow = "0 0 60px rgba(125,236,161,0.55), 0 4px 20px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 0 40px rgba(125,236,161,0.4), 0 4px 20px rgba(0,0,0,0.4)"; }}
      >
        Begin Session
      </button>

      {streak.totalSessions > 0 && (
        <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace" }}>
          {streak.totalSessions} sessions completed
        </div>
      )}
    </div>
  );
}

// ── GAME SCREEN ───────────────────────────────────────────────────────────────
function GameScreen({ onComplete, onAbort }) {
  const [cycleNum, setCycleNum]       = useState(1);
  const [phaseIdx, setPhaseIdx]       = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [circleScale, setCircleScale] = useState(0);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const startRef  = useRef(Date.now());
  const phaseRef  = useRef(Date.now());
  const animRef   = useRef(null);
  const cycleRef  = useRef(1);
  const phaseIdxRef = useRef(0);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const sessionElapsed = (now - startRef.current) / 1000;
      setSessionSecs(sessionElapsed);

      const pIdx = phaseIdxRef.current;
      const ph = PHASES[pIdx];
      const phaseElapsed = (now - phaseRef.current) / 1000;
      const rawProgress = Math.min(phaseElapsed / ph.duration, 1);

      // Ease in-out
      const eased = rawProgress * rawProgress * (3 - 2 * rawProgress);
      const scale = ph.rStart + (ph.rEnd - ph.rStart) * eased;
      setCircleScale(scale);
      setPhaseProgress(rawProgress);

      if (phaseElapsed >= ph.duration) {
        const nextPIdx = (pIdx + 1) % PHASES.length;
        phaseIdxRef.current = nextPIdx;
        phaseRef.current = Date.now();
        setPhaseIdx(nextPIdx);

        if (nextPIdx === 0) {
          // New cycle
          const nextCycle = cycleRef.current + 1;
          setCompletedCycles(cycleRef.current);
          if (nextCycle > TOTAL_CYCLES) {
            cancelAnimationFrame(animRef.current);
            onComplete(sessionElapsed);
            return;
          }
          cycleRef.current = nextCycle;
          setCycleNum(nextCycle);
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [onComplete]);

  const sm = Math.floor(sessionSecs / 60);
  const ss = Math.floor(sessionSecs % 60);
  const secsLeft = Math.max(0, phase.duration - (sessionSecs - (sessionSecs - (Date.now() - phaseRef.current) / 1000)));
  const phaseSecsLeft = phase.duration * (1 - phaseProgress);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%", animation: "fadeInUp 0.5s ease" }}>
      {/* Top HUD */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        width: "100%", maxWidth: 460, marginBottom: 24,
      }}>
        <div style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "8px 16px",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace" }}>CYCLE </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#7EC8FF", fontFamily: "'DM Mono', monospace" }}>
            {cycleNum}<span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>/{TOTAL_CYCLES}</span>
          </span>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "8px 16px",
          fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 600, color: "#FFD97D"
        }}>
          {String(sm).padStart(2,"0")}:{String(ss).padStart(2,"0")}
        </div>
      </div>

      {/* Phase Label */}
      <div style={{
        fontSize: 13, letterSpacing: 5, textTransform: "uppercase",
        color: phase.color, fontFamily: "'DM Mono', monospace",
        marginBottom: 20, opacity: 0.9,
        textShadow: `0 0 20px ${phase.glow}`,
        transition: "color 0.5s ease",
      }}>
        {phase.name}
      </div>

      {/* Circle + Arc */}
      <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <Arc progress={phaseProgress} color={phase.color} radius={44} strokeWidth={3} />
        <BreathingCircle scale={circleScale} phase={phase.name} />
      </div>

      {/* Countdown */}
      <div style={{
        fontSize: 42, fontWeight: 800, color: "#fff",
        fontFamily: "'DM Mono', monospace", letterSpacing: -2,
        textShadow: `0 0 30px ${phase.glow}`,
        transition: "color 0.5s ease", marginBottom: 28,
        minWidth: 80, textAlign: "center",
      }}>
        {phaseSecsLeft.toFixed(1)}
        <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>s</span>
      </div>

      {/* Cycle dots */}
      <div style={{ marginBottom: 32 }}>
        <CycleDots current={completedCycles} total={TOTAL_CYCLES} />
      </div>

      {/* Abort */}
      <button
        onClick={onAbort}
        style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.3)", borderRadius: 50, padding: "10px 28px",
          fontSize: 13, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: 0.5, transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.target.style.color = "rgba(255,255,255,0.6)"; e.target.style.borderColor = "rgba(255,255,255,0.2)"; }}
        onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.3)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        End Session
      </button>
    </div>
  );
}

// ── END SCREEN ────────────────────────────────────────────────────────────────
function EndScreen({ sessionSecs, streak, onReplay }) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => p + 0.04), 50);
    return () => clearInterval(id);
  }, []);

  const idleScale = 0.6 + 0.2 * ((Math.sin(pulse) + 1) / 2);
  const mins = Math.floor(sessionSecs / 60);
  const secs = Math.floor(sessionSecs % 60);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, animation: "fadeInUp 0.8s ease" }}>
      <div style={{
        fontSize: 11, letterSpacing: 6, color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Mono', monospace", marginBottom: 16, textTransform: "uppercase"
      }}>Session Complete</div>

      <h2 style={{
        fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, margin: "0 0 8px",
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #7DECA1 0%, #7EC8FF 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Well Done!</h2>

      <p style={{ color: "rgba(255,255,255,0.35)", margin: "0 0 32px", fontSize: 15 }}>
        Your mind is clearer now.
      </p>

      <div style={{ marginBottom: 32 }}>
        <BreathingCircle scale={idleScale} phase="Exhale" />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
        <StatCard label="Time" value={`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`} color="#7EC8FF" />
        <StatCard label="Cycles" value={TOTAL_CYCLES} color="#7DECA1" />
        <StatCard label="Streak" value={`${streak.count}🔥`} sub={`Best: ${streak.bestStreak}`} color="#FFD97D" />
      </div>

      {/* Total sessions */}
      <div style={{
        fontSize: 13, color: "rgba(255,255,255,0.25)",
        fontFamily: "'DM Mono', monospace", marginBottom: 32,
      }}>
        {streak.totalSessions} sessions total
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onReplay}
          style={{
            padding: "14px 40px", borderRadius: 50, border: "none", cursor: "pointer",
            fontSize: 15, fontWeight: 700, letterSpacing: 1,
            fontFamily: "'Space Grotesk', sans-serif",
            background: "linear-gradient(135deg, #7DECA1, #7EC8FF)",
            color: "#0a1628",
            boxShadow: "0 0 30px rgba(125,236,161,0.35)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          Breathe Again
        </button>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState(SCREEN.START);
  const [sessionSecs, setSessionSecs] = useState(0);
  const { streak, markSessionComplete } = useStreak();

  const handleStart = () => setScreen(SCREEN.GAME);

  const handleComplete = (secs) => {
    setSessionSecs(secs);
    markSessionComplete();
    setScreen(SCREEN.END);
  };

  const handleAbort = () => setScreen(SCREEN.START);

  const handleReplay = () => setScreen(SCREEN.GAME);

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "linear-gradient(160deg, #0a1628 0%, #0d1f3e 40%, #0b1730 70%, #081220 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Space Grotesk', sans-serif",
      position: "relative", overflow: "hidden",
      padding: "24px 16px", boxSizing: "border-box",
    }}>
      <StarField />

      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%",
        width: "50%", height: "50%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(125,236,161,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%",
        width: "60%", height: "60%", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(126,200,255,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 500,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {screen === SCREEN.START && (
          <StartScreen onStart={handleStart} streak={streak} />
        )}
        {screen === SCREEN.GAME && (
          <GameScreen onComplete={handleComplete} onAbort={handleAbort} />
        )}
        {screen === SCREEN.END && (
          <EndScreen sessionSecs={sessionSecs} streak={streak} onReplay={handleReplay} />
        )}
      </div>
    </div>
  );
}
