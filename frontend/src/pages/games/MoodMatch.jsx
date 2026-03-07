import { useState, useEffect, useCallback, useRef } from "react";

const EMOTIONS = [
  { emoji: "😊", name: "Happy",   bg: "#FFE066", border: "#F5C800" },
  { emoji: "😢", name: "Sad",     bg: "#8CB4DC", border: "#5A8FB5" },
  { emoji: "😡", name: "Angry",   bg: "#FF8C78", border: "#E05A40" },
  { emoji: "😟", name: "Anxious", bg: "#C8AAE6", border: "#9B7AC7" },
  { emoji: "😌", name: "Calm",    bg: "#A0DCBE", border: "#6AB898" },
  { emoji: "🤩", name: "Excited", bg: "#FFC882", border: "#E09A40" },
  { emoji: "😔", name: "Down",    bg: "#B4C8E6", border: "#7A9CC8" },
  { emoji: "😄", name: "Joyful",  bg: "#FFE68C", border: "#F5C800" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards() {
  const pairs = EMOTIONS.flatMap((e, idx) => [
    { id: `${idx}-a`, emotionIdx: idx },
    { id: `${idx}-b`, emotionIdx: idx },
  ]);
  return shuffle(pairs).map((c, i) => ({ ...c, pos: i }));
}

function useTimer(running) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (running) {
      if (!startRef.current) startRef.current = performance.now() - elapsed * 1000;
      const tick = () => {
        setElapsed((performance.now() - startRef.current) / 1000);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setElapsed(0);
  };

  return [elapsed, reset];
}

function Card({ card, flipped, matched, onClick, disabled }) {
  const emotion = EMOTIONS[card.emotionIdx];
  const isVisible = flipped || matched;

  return (
    <div
      onClick={!disabled && !matched && !flipped ? onClick : undefined}
      style={{
        perspective: "600px",
        cursor: disabled || matched || flipped ? "default" : "pointer",
        width: "100%",
        aspectRatio: "1 / 0.85",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: isVisible ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Card Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #63A0C8 0%, #4A7FA8 100%)",
            border: "2px solid #3A6A90",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
            transition: "box-shadow 0.2s",
          }}
        >
          <span style={{ fontSize: "clamp(20px, 3vw, 28px)", opacity: 0.5, filter: "grayscale(1)" }}>🧠</span>
        </div>

        {/* Card Face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "14px",
            background: matched
              ? "linear-gradient(135deg, #90D5AB 0%, #64B882 100%)"
              : emotion.bg,
            border: `2px solid ${matched ? "#50A068" : emotion.border}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            boxShadow: matched
              ? "0 4px 20px rgba(80,160,104,0.35)"
              : "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ fontSize: "clamp(22px, 3.5vw, 36px)", lineHeight: 1 }}>{emotion.emoji}</span>
          <span
            style={{
              fontSize: "clamp(9px, 1.2vw, 13px)",
              fontWeight: 700,
              color: matched ? "#1A5C30" : "#333",
              fontFamily: "'Nunito', sans-serif",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            {emotion.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MoodMatch() {
  const [cards, setCards] = useState(() => createCards());
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  const [elapsed, resetTimer] = useTimer(!gameOver && moves > 0);

  const handleRestart = useCallback(() => {
    setCards(createCards());
    setFlippedIds([]);
    setMatchedIds(new Set());
    setMoves(0);
    setLocked(false);
    setGameOver(false);
    setFinalTime(0);
    resetTimer();
  }, [resetTimer]);

  const handleCardClick = useCallback((cardId) => {
    if (locked || flippedIds.includes(cardId) || matchedIds.has(cardId)) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(id => cards.find(c => c.id === id));
      if (a.emotionIdx === b.emotionIdx) {
        setTimeout(() => {
          setMatchedIds(prev => {
            const next = new Set([...prev, a.id, b.id]);
            if (next.size === cards.length) {
              setGameOver(true);
              setFinalTime(elapsed);
            }
            return next;
          });
          setFlippedIds([]);
          setLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIds([]);
          setLocked(false);
        }, 900);
      }
    }
  }, [locked, flippedIds, matchedIds, cards, elapsed]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const displayTime = gameOver ? finalTime : elapsed;
  const progress = matchedIds.size / cards.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #B4D4F0; }
        .card-hover:hover > div > div:first-child {
          box-shadow: 0 6px 24px rgba(0,0,0,0.28) !important;
          transform: translateY(-2px);
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #B4D4F0 0%, #D4E8FF 50%, #DCC8F0 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Nunito', sans-serif",
        padding: "16px",
        userSelect: "none",
      }}>

        {/* Header */}
        <div style={{ width: "100%", maxWidth: "680px", marginBottom: "12px" }}>
          <div style={{ textAlign: "center", marginBottom: "4px" }}>
            <span style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#6A90B8",
              textTransform: "uppercase",
            }}>
              AROGYAM · Student Wellness
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(22px, 4vw, 34px)",
            color: "#2A4060",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 2px 8px rgba(100,150,200,0.3)",
          }}>
            Mood Match 🧠
            <span style={{ fontSize: "clamp(13px, 2vw, 17px)", fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: "#5A7898", display: "block", marginTop: "2px" }}>
              Understand Your Emotions
            </span>
          </h1>
        </div>

        {/* HUD */}
        <div style={{
          width: "100%",
          maxWidth: "680px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          borderRadius: "16px",
          padding: "10px 20px",
          marginBottom: "14px",
          border: "1px solid rgba(255,255,255,0.8)",
          boxShadow: "0 4px 20px rgba(80,120,180,0.12)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#8AA8C8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Moves</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: "#2A4060" }}>{moves}</div>
          </div>

          {/* Progress bar */}
          <div style={{ flex: 1, margin: "0 20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#8AA8C8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: "4px" }}>
              {matchedIds.size / 2} / {cards.length / 2} pairs
            </div>
            <div style={{ height: "8px", background: "rgba(100,150,200,0.2)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg, #64B882, #4A9868)",
                borderRadius: "99px",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#8AA8C8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Time</div>
            <div style={{ fontSize: "22px", fontWeight: 900, color: "#2A4060", fontVariantNumeric: "tabular-nums" }}>{formatTime(displayTime)}</div>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          width: "100%",
          maxWidth: "680px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(6px, 1.5vw, 12px)",
          padding: "clamp(8px, 2vw, 16px)",
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 8px 32px rgba(80,120,180,0.15)",
        }}>
          {cards.map(card => (
            <div key={card.id} className="card-hover">
              <Card
                card={card}
                flipped={flippedIds.includes(card.id)}
                matched={matchedIds.has(card.id)}
                onClick={() => handleCardClick(card.id)}
                disabled={locked}
              />
            </div>
          ))}
        </div>

        {/* Restart button */}
        <button
          onClick={handleRestart}
          style={{
            marginTop: "16px",
            padding: "10px 28px",
            background: "linear-gradient(135deg, #FF9A40, #FF7020)",
            color: "#fff",
            border: "none",
            borderRadius: "99px",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: "14px",
            letterSpacing: "0.05em",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(255,112,32,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.06)"; e.target.style.boxShadow = "0 6px 20px rgba(255,112,32,0.45)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 16px rgba(255,112,32,0.35)"; }}
        >
          🔄 New Game
        </button>

        {/* Game Over Overlay */}
        {gameOver && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,30,60,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            animation: "fadeIn 0.35s ease",
          }}>
            <div style={{
              background: "linear-gradient(160deg, #FFFDF5 0%, #F0F6FF 100%)",
              borderRadius: "24px",
              padding: "40px 48px",
              maxWidth: "420px",
              width: "90%",
              textAlign: "center",
              border: "2px solid #FF9A40",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
              <div style={{ fontSize: "52px", animation: "pulse 1s ease infinite", marginBottom: "8px" }}>🏆</div>
              <h2 style={{
                fontFamily: "'Fredoka One', cursive",
                fontSize: "26px",
                color: "#2A4060",
                marginBottom: "8px",
              }}>
                All Emotions Matched!
              </h2>
              <p style={{ color: "#6A7A9A", fontWeight: 600, fontSize: "15px", marginBottom: "20px" }}>
                {moves} moves · {formatTime(finalTime)}
              </p>
              <div style={{
                background: "linear-gradient(135deg, #E8F8EE, #D0F0DC)",
                borderRadius: "14px",
                padding: "14px 20px",
                marginBottom: "24px",
                border: "1px solid #90D5AB",
              }}>
                <p style={{ color: "#2A6840", fontWeight: 700, fontSize: "14px", lineHeight: 1.5 }}>
                  💚 Recognizing emotions helps improve mental wellbeing. Great work!
                </p>
              </div>
              <button
                onClick={handleRestart}
                style={{
                  padding: "12px 32px",
                  background: "linear-gradient(135deg, #FF9A40, #FF7020)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "99px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,112,32,0.4)",
                }}
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
