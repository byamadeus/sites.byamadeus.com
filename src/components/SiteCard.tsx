interface SiteCardProps {
  href?: string;
  title?: string;
  description?: string;
  previewSrc?: string;
  preview?: React.ReactNode;
  tags?: string[];
  variant?: "default" | "empty" | "wip";
}

import { SquareArrowOutUpRight, Hammer } from 'lucide-react';
import { useState } from 'react';

export function SiteCard({
  href,
  title,
  description,
  previewSrc,
  tags = [],
  variant = "default",
}: SiteCardProps) {
  const isEmpty = variant === "empty";
  const isWip = variant === "wip";
  const [showTooltip, setShowTooltip] = useState(false);

  const Wrapper = isEmpty || isWip ? "div" : "a";

  return (
    <div className="relative w-full">
      <Wrapper
        {...(!isEmpty && !isWip && {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        onMouseEnter={() => isWip && setShowTooltip(true)}
        onMouseLeave={() => isWip && setShowTooltip(false)}
        className={isWip ? "cursor-not-allowed" : ""}
      >
        {isEmpty ? (
          <div className="rounded-2xl border-2 border-white/20 border-dashed bg-white/5 backdrop-blur-sm transition hover:bg-white/10 overflow-hidden">
            <div className="flex flex-col items-center justify-center aspect-video text-white/30">
              <p className="text-sm">What will your site be?</p>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm transition overflow-hidden ${
              isWip ? "hover:opacity-50" : "hover:bg-white/10"
            }`}
          >
            {!isWip && (
              <div className="w-full aspect-video bg-white/5 overflow-hidden">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10" />
                )}
              </div>
            )}

            <div className="flex w-full flex-row p-6 justify-between items-start gap-4">
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-lg text-white/90 font-medium">{title}</p>
                <p className="text-sm text-white/50">{description}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/15 text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="shrink-0 mt-0.5">
                {isWip ? <Hammer size={16} className="text-white/40" /> : <SquareArrowOutUpRight size={16} className="text-white/40" />}
              </div>
            </div>
          </div>
        )}
      </Wrapper>

      {isWip && showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-md px-4 py-2 shadow-lg overflow-hidden w-48">
            <div className="overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-xs">
                Coming soon... Still building... Almost there... Coming soon... Still building... Almost there...
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
