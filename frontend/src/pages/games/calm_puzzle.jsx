import { useState, useEffect, useCallback, useRef } from "react";

// ─── Tile SVG scenes drawn via Canvas ───────────────────────────────────────
const TILE_SCENES = [
  // 0: upper-left – sky + left mountain shoulder + cloud
  (ctx, s) => {
    const sky = ctx.createLinearGradient(0, 0, 0, s);
    sky.addColorStop(0, "#87CEEB"); sky.addColorStop(1, "#b0dff0");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, s, s);
    // mountain
    ctx.fillStyle = "#5a6e82";
    ctx.beginPath(); ctx.moveTo(s, s * 0.67); ctx.lineTo(s * 2, s * 1.4); ctx.lineTo(0, s * 1.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#7890a0";
    ctx.beginPath(); ctx.moveTo(s, s * 0.67); ctx.lineTo(s * 2, s * 1.35); ctx.lineTo(0, s * 1.35); ctx.closePath(); ctx.fill();
    // snow
    ctx.fillStyle = "#e8f4fc";
    ctx.beginPath(); ctx.moveTo(s, s * 0.67); ctx.lineTo(s - 18, s * 0.67 + 30); ctx.lineTo(s + 18, s * 0.67 + 30); ctx.closePath(); ctx.fill();
    // cloud
    ctx.fillStyle = "rgba(240,248,255,0.92)";
    ctx.beginPath(); ctx.ellipse(45, 28, 32, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(58, 20, 26, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(75, 25, 22, 10, 0, 0, Math.PI * 2); ctx.fill();
  },
  // 1: upper-center – sky + mountain peak
  (ctx, s) => {
    const sky = ctx.createLinearGradient(0, 0, 0, s);
    sky.addColorStop(0, "#87CEEB"); sky.addColorStop(1, "#b0dff0");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#5a6e82";
    ctx.beginPath(); ctx.moveTo(s / 2, s * 0.1); ctx.lineTo(s * 1.5, s * 1.4); ctx.lineTo(-s * 0.5, s * 1.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#7890a0";
    ctx.beginPath(); ctx.moveTo(s / 2, s * 0.1); ctx.lineTo(s * 1.5, s * 1.35); ctx.lineTo(-s * 0.5, s * 1.35); ctx.closePath(); ctx.fill();
    // snow cap
    ctx.fillStyle = "#e8f4fc";
    ctx.beginPath(); ctx.moveTo(s / 2, s * 0.1); ctx.lineTo(s / 2 - 22, s * 0.1 + 38); ctx.lineTo(s / 2 + 22, s * 0.1 + 38); ctx.closePath(); ctx.fill();
    // small cloud
    ctx.fillStyle = "rgba(240,248,255,0.85)";
    ctx.beginPath(); ctx.ellipse(s * 0.78, 32, 24, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.85, 24, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
  },
  // 2: upper-right – sky + right mountain shoulder
  (ctx, s) => {
    const sky = ctx.createLinearGradient(0, 0, 0, s);
    sky.addColorStop(0, "#87CEEB"); sky.addColorStop(1, "#b0dff0");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#5a6e82";
    ctx.beginPath(); ctx.moveTo(0, s * 0.67); ctx.lineTo(-s, s * 1.4); ctx.lineTo(s * 2, s * 1.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#7890a0";
    ctx.beginPath(); ctx.moveTo(0, s * 0.67); ctx.lineTo(-s, s * 1.35); ctx.lineTo(s * 2, s * 1.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e8f4fc";
    ctx.beginPath(); ctx.moveTo(0, s * 0.67); ctx.lineTo(-18, s * 0.67 + 30); ctx.lineTo(18, s * 0.67 + 30); ctx.closePath(); ctx.fill();
    // cloud right
    ctx.fillStyle = "rgba(240,248,255,0.92)";
    ctx.beginPath(); ctx.ellipse(s * 0.65, 22, 30, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.82, 15, 24, 10, 0, 0, Math.PI * 2); ctx.fill();
  },
  // 3: middle-left – mountain base + treeline + lake edge
  (ctx, s) => {
    const grass = ctx.createLinearGradient(0, 0, 0, s);
    grass.addColorStop(0, "#3c7840"); grass.addColorStop(1, "#6e9b64");
    ctx.fillStyle = grass; ctx.fillRect(0, 0, s, s);
    // mountain base
    ctx.fillStyle = "#5a6e82";
    ctx.beginPath(); ctx.moveTo(s, -10); ctx.lineTo(s * 2, s * 0.5); ctx.lineTo(0, s * 0.5); ctx.closePath(); ctx.fill();
    // pine trees
    for (let tx = 0; tx < s / 2; tx += 30) drawPine(ctx, tx, s, 55, "#1e5028");
    // water strip
    drawWater(ctx, s * 0.75, s * 0.25, s);
  },
  // 4: middle-center – lake reflection + tree
  (ctx, s) => {
    const grass = ctx.createLinearGradient(0, 0, 0, s / 2);
    grass.addColorStop(0, "#5a9b50"); grass.addColorStop(1, "#6eb964");
    ctx.fillStyle = grass; ctx.fillRect(0, 0, s, s / 2);
    drawWater(ctx, s / 2, s / 2, s);
    // mountain reflection
    ctx.fillStyle = "rgba(50,100,150,0.5)";
    ctx.beginPath(); ctx.moveTo(s / 2, s / 2); ctx.lineTo(s / 2 - 50, s / 2 + 40); ctx.lineTo(s / 2 + 50, s / 2 + 40); ctx.closePath(); ctx.fill();
    drawPine(ctx, s / 2, s / 2, 58, "#326e3a");
  },
  // 5: middle-right – grass + trees + lake edge
  (ctx, s) => {
    const grass = ctx.createLinearGradient(0, 0, 0, s);
    grass.addColorStop(0, "#3c7840"); grass.addColorStop(1, "#6e9b64");
    ctx.fillStyle = grass; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = "#5a6e82";
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(-s, s * 0.5); ctx.lineTo(s * 2, s * 0.5); ctx.closePath(); ctx.fill();
    for (let tx = s / 2; tx < s; tx += 32) drawPine(ctx, tx, s, 50, "#1e5028");
    drawWater(ctx, s * 0.75, s * 0.25, s);
  },
  // 6: lower-left – lake shore + reeds
  (ctx, s) => {
    drawWater(ctx, 0, s * 0.6, s);
    const shore = ctx.createLinearGradient(0, s * 0.6, 0, s);
    shore.addColorStop(0, "#6eb950"); shore.addColorStop(1, "#90c878");
    ctx.fillStyle = shore; ctx.fillRect(0, s * 0.6, s, s * 0.4);
    // reeds
    for (let rx = 10; rx < 65; rx += 18) {
      ctx.strokeStyle = "#466e3c"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(rx, s * 0.6 + 5); ctx.lineTo(rx + 5, s * 0.6 - 30); ctx.stroke();
      ctx.fillStyle = "#643c1e";
      ctx.beginPath(); ctx.ellipse(rx, s * 0.6 - 40, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
    }
  },
  // 7: lower-center – full lake + sun path
  (ctx, s) => {
    drawWater(ctx, 0, s, s);
    // golden sun reflection
    for (let sy = s / 3; sy < s; sy += 4) {
      const alpha = 1 - sy / s;
      const w = Math.floor(60 * alpha) + 10;
      ctx.fillStyle = `rgba(200,185,80,${alpha * 0.7})`;
      ctx.beginPath(); ctx.ellipse(s / 2, sy + 2, w / 2, 2, 0, 0, Math.PI * 2); ctx.fill();
    }
  },
  // 8: lower-right – lake + tree silhouette
  (ctx, s) => {
    drawWater(ctx, 0, s * 0.6, s);
    const shore = ctx.createLinearGradient(0, s * 0.6, 0, s);
    shore.addColorStop(0, "#6eb950"); shore.addColorStop(1, "#90c878");
    ctx.fillStyle = shore; ctx.fillRect(0, s * 0.6, s, s * 0.4);
    for (let tx = s - 60; tx < s + 20; tx += 24) drawPine(ctx, tx, s * 0.6, 40, "#1e5028");
  },
];

function drawPine(ctx, cx, baseY, h, color) {
  const w = h / 2;
  ctx.fillStyle = color;
  for (let layer = 0; layer < 3; layer++) {
    const ly = baseY - h + layer * (h / 3);
    const lw = w - layer * (w / 4);
    ctx.beginPath();
    ctx.moveTo(cx, ly - h / 3);
    ctx.lineTo(cx - lw, ly + h / 5);
    ctx.lineTo(cx + lw, ly + h / 5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#644628";
  ctx.fillRect(cx - 3, baseY - h / 6, 6, h / 6);
}

function drawWater(ctx, yStart, height, s) {
  const grad = ctx.createLinearGradient(0, yStart, 0, yStart + height);
  grad.addColorStop(0, "#3c82b4"); grad.addColorStop(1, "#82bee6");
  ctx.fillStyle = grad; ctx.fillRect(0, yStart, s, height);
  ctx.strokeStyle = "rgba(150,210,235,0.6)"; ctx.lineWidth = 2;
  for (let wy = yStart + 10; wy < yStart + height; wy += 18) {
    for (let wx = 0; wx < s; wx += 30) {
      ctx.beginPath(); ctx.arc(wx + 10, wy, 10, Math.PI, 0); ctx.stroke();
    }
  }
}

// Pre-render tile to data URL
function renderTile(index, size = 140) {
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  TILE_SCENES[index](ctx, size);
  return canvas.toDataURL();
}

// ─── Puzzle logic ────────────────────────────────────────────────────────────
function createBoard() { return [0,1,2,3,4,5,6,7,8]; }

function isSolvable(board) {
  const tiles = board.filter(t => t !== 8);
  let inv = 0;
  for (let i = 0; i < tiles.length; i++)
    for (let j = i + 1; j < tiles.length; j++)
      if (tiles[i] > tiles[j]) inv++;
  return inv % 2 === 0;
}

function shuffle(board) {
  const solved = createBoard();
  let b;
  do { b = [...board].sort(() => Math.random() - 0.5); }
  while (JSON.stringify(b) === JSON.stringify(solved) || !isSolvable(b));
  return b;
}

function getEmpty(board) {
  const idx = board.indexOf(8);
  return { row: Math.floor(idx / 3), col: idx % 3, idx };
}

function moveTile(board, row, col) {
  const { row: er, col: ec } = getEmpty(board);
  if (Math.abs(row - er) + Math.abs(col - ec) !== 1) return null;
  const nb = [...board];
  const ti = row * 3 + col, ei = er * 3 + ec;
  [nb[ti], nb[ei]] = [nb[ei], nb[ti]];
  return nb;
}

function checkWin(board) { return board.every((v, i) => v === i); }

// ─── Main component ──────────────────────────────────────────────────────────
export default function CalmPuzzle() {
  const TILE = 130;
  const GAP = 6;

  const [tileImages, setTileImages] = useState([]);
  const [board, setBoard] = useState(() => shuffle(createBoard()));
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const [animating, setAnimating] = useState(null); // { tile, fromX, fromY, toX, toY }
  const [pendingBoard, setPendingBoard] = useState(null);
  const [orbPositions] = useState(() =>
    Array.from({ length: 6 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 60,
      opacity: 0.06 + Math.random() * 0.1,
      speed: 8 + Math.random() * 14,
    }))
  );
  const startRef = useRef(Date.now());
  const timerRef = useRef(null);
  const animFrameRef = useRef(null);
  const winElapsedRef = useRef(0);

  // Pre-render tiles once
  useEffect(() => {
    setTileImages(TILE_SCENES.map((_, i) => renderTile(i, TILE)));
  }, []);

  // Timer
  useEffect(() => {
    if (won) return;
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [won]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const tilePos = (idx) => ({
    x: (idx % 3) * (TILE + GAP),
    y: Math.floor(idx / 3) * (TILE + GAP),
  });

  const handleClick = useCallback((row, col) => {
    if (won || animating) return;
    const nb = moveTile(board, row, col);
    if (!nb) return;

    const clickedIdx = row * 3 + col;
    const { idx: emptyIdx } = getEmpty(board);
    const from = tilePos(clickedIdx);
    const to = tilePos(emptyIdx);
    const tile = board[clickedIdx];

    setAnimating({ tile, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, progress: 0 });
    setPendingBoard(nb);
    setMoves(m => m + 1);

    // Animate via rAF
    const start = performance.now();
    const dur = 160;
    const animate = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setAnimating(a => a ? { ...a, progress: ease } : null);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimating(null);
        setBoard(nb);
        setPendingBoard(null);
        if (checkWin(nb)) {
          winElapsedRef.current = Math.floor((Date.now() - startRef.current) / 1000);
          setWon(true);
        }
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [board, won, animating]);

  useEffect(() => () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }, []);

  const reset = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setAnimating(null);
    setPendingBoard(null);
    setBoard(shuffle(createBoard()));
    setMoves(0);
    setElapsed(0);
    setWon(false);
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "r" || e.key === "R") reset(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [reset]);

  const boardPx = 3 * (TILE + GAP) - GAP;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #b4d9f0 0%, #c8edd8 50%, #d4ecc8 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
      position: "relative",
      overflow: "hidden",
      padding: "20px",
    }}>
      {/* Floating orbs */}
      {orbPositions.map((o, i) => (
        <div key={i} style={{
          position: "absolute",
          borderRadius: "50%",
          background: "white",
          opacity: o.opacity,
          width: o.size,
          height: o.size,
          left: `${o.x}%`,
          top: `${o.y}%`,
          animation: `float-${i % 3} ${o.speed}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <style>{`
        @keyframes float-0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
        @keyframes float-1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-40px)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes winPop { 0%{opacity:0;transform:scale(0.85)} 100%{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{opacity:0.7} 50%{opacity:1} 100%{opacity:0.7} }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: 24,
        animation: "fadeInDown 0.7s ease both",
      }}>
        <div style={{ fontSize: 11, letterSpacing: "0.28em", color: "#5a9ab0", fontStyle: "italic", marginBottom: 4 }}>
          AROGYAM MENTAL WELLNESS
        </div>
        <h1 style={{
          margin: 0,
          fontSize: 26,
          fontWeight: "bold",
          color: "#2e5068",
          letterSpacing: "0.04em",
        }}>
          Calm Puzzle
        </h1>
        <div style={{ fontSize: 13, color: "#6a8a9a", fontStyle: "italic", marginTop: 2 }}>
          Relax Your Mind
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

        {/* Board */}
        <div style={{
          position: "relative",
          width: boardPx,
          height: boardPx,
          borderRadius: 18,
          boxShadow: "0 8px 40px rgba(60,130,170,0.18), 0 2px 8px rgba(60,130,170,0.1)",
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(8px)",
          padding: 10,
          animation: "fadeInDown 0.8s 0.1s ease both",
        }}>
          {board.map((tile, idx) => {
            const row = Math.floor(idx / 3), col = idx % 3;
            const pos = tilePos(idx);
            const isEmpty = tile === 8;

            let drawX = pos.x, drawY = pos.y;
            if (animating && animating.tile === tile) {
              drawX = animating.fromX + (animating.toX - animating.fromX) * animating.progress;
              drawY = animating.fromY + (animating.toY - animating.fromY) * animating.progress;
            }

            return (
              <div
                key={tile}
                onClick={() => !isEmpty && handleClick(row, col)}
                style={{
                  position: "absolute",
                  left: drawX + 10,
                  top: drawY + 10,
                  width: TILE,
                  height: TILE,
                  borderRadius: 14,
                  cursor: isEmpty ? "default" : "pointer",
                  transition: animating?.tile === tile ? "none" : undefined,
                  background: isEmpty
                    ? "rgba(180,215,235,0.45)"
                    : "white",
                  boxShadow: isEmpty
                    ? "inset 0 2px 8px rgba(100,160,200,0.2)"
                    : "0 3px 12px rgba(60,120,160,0.18), 0 1px 3px rgba(60,120,160,0.1)",
                  overflow: "hidden",
                  zIndex: animating?.tile === tile ? 10 : 1,
                }}
              >
                {!isEmpty && tileImages[tile] && (
                  <>
                    <img
                      src={tileImages[tile]}
                      alt={`Tile ${tile + 1}`}
                      style={{ width: "100%", height: "100%", display: "block", borderRadius: 14, userSelect: "none" }}
                      draggable={false}
                    />
                    {/* border overlay */}
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: 14,
                      boxShadow: "inset 0 0 0 2px rgba(140,190,210,0.6)",
                      pointerEvents: "none",
                    }} />
                    {/* tile number */}
                    <div style={{
                      position: "absolute", top: 5, left: 7,
                      fontSize: 11, fontWeight: "bold", color: "rgba(80,130,165,0.85)",
                      fontFamily: "Georgia, serif", lineHeight: 1,
                    }}>{tile + 1}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats panel */}
        <div style={{
          width: 140,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(10px)",
          borderRadius: 18,
          padding: "22px 16px",
          boxShadow: "0 4px 20px rgba(80,150,180,0.13)",
          border: "1.5px solid rgba(160,200,220,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          animation: "fadeInDown 0.9s 0.2s ease both",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a9ab0", marginBottom: 4 }}>MOVES</div>
            <div style={{ fontSize: 40, fontWeight: "bold", color: "#2e5068", lineHeight: 1 }}>{moves}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#5a9ab0", marginBottom: 4 }}>TIME</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#2e5068", fontVariantNumeric: "tabular-nums" }}>
              {fmtTime(won ? winElapsedRef.current : elapsed)}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(160,200,220,0.4)", paddingTop: 14, fontSize: 11, color: "#5a7a8a", lineHeight: 1.7 }}>
            <div>Click adjacent tile</div>
            <div>to move it.</div>
            <div style={{ marginTop: 8 }}><kbd style={{ background: "rgba(90,154,176,0.15)", borderRadius: 4, padding: "1px 5px", fontFamily: "monospace" }}>R</kbd> Restart</div>
          </div>
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(135deg, #5a9ab0, #3d7a96)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "9px 0",
              fontSize: 12,
              letterSpacing: "0.12em",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: "bold",
              boxShadow: "0 3px 10px rgba(60,120,150,0.25)",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            NEW GAME
          </button>
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(200,240,215,0.88)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          animation: "winPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          <div style={{
            textAlign: "center",
            padding: "44px 56px",
            background: "rgba(255,255,255,0.8)",
            borderRadius: 24,
            boxShadow: "0 16px 60px rgba(60,140,100,0.25)",
          }}>
            {/* Leaves */}
            <div style={{ fontSize: 32, marginBottom: 12, animation: "shimmer 2s infinite" }}>🌿 🍃 🌿</div>
            <div style={{ fontSize: 28, fontWeight: "bold", color: "#2e5068", marginBottom: 10 }}>
              Great job! Your mind is calm.
            </div>
            <div style={{ fontSize: 15, color: "#5a9ab0", marginBottom: 24 }}>
              Completed in <b>{moves}</b> moves &nbsp;·&nbsp; {fmtTime(winElapsedRef.current)}
            </div>
            <button
              onClick={reset}
              style={{
                background: "linear-gradient(135deg, #5a9ab0, #3d7a96)",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 32px",
                fontSize: 14,
                fontFamily: "inherit",
                letterSpacing: "0.12em",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(60,120,150,0.3)",
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Footer hint */}
      <div style={{ marginTop: 20, fontSize: 11, color: "#7aa0b0", fontStyle: "italic", opacity: 0.8 }}>
        Arrange the tiles to reveal the peaceful mountain scene
      </div>
    </div>
  );
}
