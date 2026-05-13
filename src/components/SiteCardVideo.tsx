"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import MuxPlayer from "@mux/mux-player-react";

const LOOP_SEC      = 5;    // seconds of video to play per cycle
const HOLD_MS       = 1800; // ms to show image between cycles
const FADE_MS       = 600;  // crossfade duration
const PRE_START_MS  = 400;  // video starts playing this long before fade-in begins

export function SiteCardVideo({
  playbackId,
  previewSrc,
  alt,
  isActive,
}: {
  playbackId: string;
  previewSrc?: string;
  alt?: string;
  isActive?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef  = useRef<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const running    = useRef(false);
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (timer.current) clearTimeout(timer.current); };

  // Kick off one image→video→image cycle
  const runCycle = useCallback(() => {
    if (!running.current) return;
    // Pre-start: video begins playing while image is still fully visible
    timer.current = setTimeout(() => {
      if (!running.current) return;
      const el = playerRef.current;
      if (el) { el.currentTime = 0; el.play().catch(() => {}); }
      // Fade in after the pre-start buffer — video already running
      timer.current = setTimeout(() => {
        if (!running.current) return;
        setShowVideo(true);
      }, PRE_START_MS);
    }, HOLD_MS - PRE_START_MS);
  }, []);

  const endCycle = useCallback(() => {
    clearTimer();
    setShowVideo(false);
    const el = playerRef.current;
    if (el) el.pause();
    // Wait for fade-out then restart
    timer.current = setTimeout(() => {
      const el2 = playerRef.current;
      if (el2) el2.currentTime = 0;
      runCycle();
    }, FADE_MS);
  }, [runCycle]);

  // Start/stop based on isActive
  useEffect(() => {
    if (isActive) {
      running.current = true;
      runCycle();
    } else {
      running.current = false;
      clearTimer();
      setShowVideo(false);
      const el = playerRef.current;
      if (el) { el.pause(); el.currentTime = 0; }
    }
    return clearTimer;
  }, [isActive, runCycle]);

  const onTimeUpdate = useCallback(() => {
    const el = playerRef.current;
    if (!el || !running.current) return;
    if (el.currentTime >= LOOP_SEC) {
      endCycle();
    }
  }, [endCycle]);

  return (
    <div className="relative w-full h-full">
      {/* Image — always visible as base */}
      {previewSrc && (
        <img
          src={previewSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video — fades in over the image */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showVideo ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
          pointerEvents: "none", // keeps card hover/click working
        }}
      >
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          muted
          autoPlay={false}
          loop={false}
          onTimeUpdate={onTimeUpdate}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
    </div>
  );
}
