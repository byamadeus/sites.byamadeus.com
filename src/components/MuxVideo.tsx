"use client";

import MuxPlayer from "@mux/mux-player-react";

interface MuxVideoProps {
  playbackId: string;
  className?: string;
}

export function MuxVideo({ playbackId, className }: MuxVideoProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      autoPlay="muted"
      muted
      loop
      className={className}
      style={{ width: "100%", display: "block", aspectRatio: "16/9" }}
    />
  );
}
