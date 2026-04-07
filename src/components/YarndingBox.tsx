'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const YARNDING_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const CHAR_SIZE = 48;
const RADIUS = CHAR_SIZE / 2;
const GRAVITY = 0.35;
const RESTITUTION_WALL = 0.62;   // energy kept on wall/floor bounce
const RESTITUTION_CHAR = 0.55;   // energy kept on character-character bounce
const FLOOR_FRICTION = 0.78;     // horizontal damping when sliding on floor
const SLEEP_SPEED = 0.08;        // squared speed below which a character sleeps

const COLORS = [
  'rgba(255,255,255,0.85)',
  'rgba(167,139,250,0.85)',
  'rgba(96,165,250,0.85)',
  'rgba(52,211,153,0.85)',
  'rgba(251,191,36,0.85)',
  'rgba(251,113,133,0.85)',
];

interface Body {
  id: number;
  char: string;
  color: string;
  // center position
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  sleeping: boolean;
}

export function YarndingBox() {
  const [bodies, setBodies] = useState<Body[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<Body[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);
  const loopRunning = useRef(false);

  const runLoop = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;

    const W = box.clientWidth;
    const H = box.clientHeight;

    const bs = bodiesRef.current.map((b) => ({ ...b }));

    // --- gravity & integrate ---
    for (const b of bs) {
      if (b.sleeping) continue;
      b.vy += GRAVITY;
      b.cx += b.vx;
      b.cy += b.vy;
    }

    // --- wall & floor collisions ---
    for (const b of bs) {
      if (b.sleeping) continue;

      // left wall
      if (b.cx - RADIUS < 0) {
        b.cx = RADIUS;
        b.vx = Math.abs(b.vx) * RESTITUTION_WALL;
      }
      // right wall
      if (b.cx + RADIUS > W) {
        b.cx = W - RADIUS;
        b.vx = -Math.abs(b.vx) * RESTITUTION_WALL;
      }
      // floor
      if (b.cy + RADIUS > H) {
        b.cy = H - RADIUS;
        b.vy = -Math.abs(b.vy) * RESTITUTION_WALL;
        b.vx *= FLOOR_FRICTION;
      }
      // ceiling (spawn entry)
      if (b.cy - RADIUS < 0) {
        b.cy = RADIUS;
        b.vy = Math.abs(b.vy) * RESTITUTION_WALL;
      }
    }

    // --- character-character collisions (O(n²), fine for small n) ---
    for (let i = 0; i < bs.length; i++) {
      for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i];
        const b = bs[j];

        const dx = b.cx - a.cx;
        const dy = b.cy - a.cy;
        const distSq = dx * dx + dy * dy;
        const minDist = CHAR_SIZE; // 2 * RADIUS

        if (distSq >= minDist * minDist || distSq === 0) continue;

        const dist = Math.sqrt(distSq);
        const nx = dx / dist;
        const ny = dy / dist;

        // Separate overlapping bodies
        const overlap = (minDist - dist) / 2;
        a.cx -= nx * overlap;
        a.cy -= ny * overlap;
        b.cx += nx * overlap;
        b.cy += ny * overlap;

        // Wake sleeping bodies on impact
        if (a.sleeping) { a.sleeping = false; }
        if (b.sleeping) { b.sleeping = false; }

        // Relative velocity along normal
        const dvx = b.vx - a.vx;
        const dvy = b.vy - a.vy;
        const dvn = dvx * nx + dvy * ny;

        // Only resolve if approaching
        if (dvn >= 0) continue;

        const impulse = dvn * RESTITUTION_CHAR;
        a.vx += impulse * nx;
        a.vy += impulse * ny;
        b.vx -= impulse * nx;
        b.vy -= impulse * ny;
      }
    }

    // --- sleep check ---
    let anyAwake = false;
    for (const b of bs) {
      const speedSq = b.vx * b.vx + b.vy * b.vy;
      if (!b.sleeping && speedSq < SLEEP_SPEED) {
        b.sleeping = true;
        b.vx = 0;
        b.vy = 0;
      } else if (!b.sleeping) {
        anyAwake = true;
      }
    }

    bodiesRef.current = bs;
    setBodies([...bs]);

    if (anyAwake) {
      animFrameRef.current = requestAnimationFrame(runLoop);
    } else {
      loopRunning.current = false;
      animFrameRef.current = null;
    }
  }, []);

  const spawnBody = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const box = boxRef.current;
      if (!box) return;

      const rect = box.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const cx = Math.max(RADIUS, Math.min(rect.width - RADIUS, clickX));

      const newBody: Body = {
        id: nextIdRef.current++,
        char: YARNDING_CHARS[Math.floor(Math.random() * YARNDING_CHARS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        cx,
        cy: RADIUS,
        vx: (Math.random() - 0.5) * 3,
        vy: 0,
        sleeping: false,
      };

      bodiesRef.current = [...bodiesRef.current, newBody];
      setBodies([...bodiesRef.current]);

      // Wake any sleeping bodies so they react to the new arrival
      for (const b of bodiesRef.current) b.sleeping = false;

      if (!loopRunning.current) {
        loopRunning.current = true;
        animFrameRef.current = requestAnimationFrame(runLoop);
      }
    },
    [runLoop]
  );

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      onClick={spawnBody}
      className="rounded-xl border-2 border-white/20 border-dashed bg-white/5 backdrop-blur-sm transition hover:bg-white/10 overflow-hidden cursor-pointer relative select-none"
      style={{ aspectRatio: '16/9' }}
    >
      {bodies.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-white/30 pointer-events-none">
          <p className="text-sm">What will your site be?</p>
        </div>
      )}
      {bodies.map((b) => (
        <span
          key={b.id}
          style={{
            position: 'absolute',
            left: b.cx - RADIUS,
            top: b.cy - RADIUS,
            fontFamily: "'Yarndings 20', sans-serif",
            fontSize: `${CHAR_SIZE}px`,
            lineHeight: 1,
            color: b.color,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {b.char}
        </span>
      ))}
    </div>
  );
}
