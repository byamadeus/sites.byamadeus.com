"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { flushSync } from "react-dom";
import { SiteCard } from "./SiteCard";

interface Site {
  slug: string;
  href?: string | null;
  title: string;
  description: string;
  preview?: string | null;
  muxId?: string | null;
  tags?: string[];
}

const GAP = 16;
const CARD_W = "80vw";
const INTERVAL = 5000;
const SPRING = "0.62s cubic-bezier(0.22, 1, 0.36, 1)";
const DRAG_THRESHOLD = 50;
const VEL_THRESHOLD  = 0.25;

export function SiteCarousel({ sites }: { sites: Site[] }) {
  const n = sites.length;
  const cloned = [sites[n - 1], ...sites, sites[0]];

  const [idx, setIdx]             = useState(1);
  const [animated, setAnimated]   = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging]   = useState(false);
  // Increments on every user interaction → resets timer bar animation via key
  const [timerKey, setTimerKey]   = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX   = useRef(0);
  const lastX    = useRef(0);
  const lastT    = useRef(0);
  const velocity = useRef(0);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimated(true);
      setIdx((i) => i + 1);
      setTimerKey((k) => k + 1);
    }, INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (idx === n + 1 || idx === 0) {
      const jumpTo = idx === n + 1 ? 1 : n;
      flushSync(() => {
        setAnimated(false);
        setIdx(jumpTo);
      });
      requestAnimationFrame(() => setAnimated(true));
    }
  };

  const realIdx = idx <= 0 ? n - 1 : idx >= n + 1 ? 0 : idx - 1;

  const bumpTimer = () => {
    setTimerKey((k) => k + 1);
    resetTimer();
  };

  const goTo = (i: number) => {
    setAnimated(true);
    setIdx(i + 1);
    bumpTimer();
  };

  // ── Drag ────────────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setAnimated(false);
    startX.current   = e.clientX;
    lastX.current    = e.clientX;
    lastT.current    = Date.now();
    velocity.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const now = Date.now();
    const dt  = now - lastT.current;
    if (dt > 0) velocity.current = (e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastT.current = now;
    setDragOffset(e.clientX - startX.current);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    setAnimated(true);
    setDragOffset(0);
    const offset = e.clientX - startX.current;
    if (velocity.current < -VEL_THRESHOLD || offset < -DRAG_THRESHOLD) {
      setIdx((i) => i + 1);
    } else if (velocity.current > VEL_THRESHOLD || offset > DRAG_THRESHOLD) {
      setIdx((i) => i - 1);
    }
    bumpTimer();
  };

  const cardPx = typeof window !== "undefined" ? window.innerWidth * 0.8 + GAP : 700;
  const dragProgress = Math.max(-1, Math.min(1, dragOffset / cardPx));

  const scaleFor = (i: number) => {
    if (!animated && !dragging) return i === idx ? 1 : 0.88;
    if (dragging) {
      if (i === idx)                            return 1 - 0.12 * Math.abs(dragProgress);
      if (i === idx + 1 && dragProgress < 0)    return 0.88 + 0.12 * Math.abs(dragProgress);
      if (i === idx - 1 && dragProgress > 0)    return 0.88 + 0.12 * Math.abs(dragProgress);
      return 0.88;
    }
    return i === idx ? 1 : 0.88;
  };

  const cardTransition = (!animated || dragging) ? "none" : `transform ${SPRING}`;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="w-full"
        style={{ cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex items-stretch"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(calc(50% - ${idx} * (${CARD_W} + ${GAP}px) - ${CARD_W} / 2 + ${dragOffset}px))`,
            transition: (!animated || dragging) ? "none" : `transform ${SPRING}`,
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {cloned.map((site, i) => (
            <div
              key={`${site.slug}-${i}`}
              style={{
                width: CARD_W,
                flexShrink: 0,
                transform: `scale(${scaleFor(i)})`,
                transition: cardTransition,
                transformOrigin: "center center",
                pointerEvents: dragging ? "none" : "auto",
              }}
            >
              <SiteCard
                href={site.href ?? undefined}
                title={site.title}
                description={site.description}
                previewSrc={site.preview ?? undefined}
                muxId={site.muxId ?? undefined}
                tags={site.tags}
                isActive={i === idx}
                timerKey={i === idx ? timerKey : -1}
                variant="default"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1.5">
        {sites.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full cursor-pointer transition-all duration-300"
            style={{
              width: i === realIdx ? "20px" : "6px",
              height: "6px",
              background: i === realIdx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
