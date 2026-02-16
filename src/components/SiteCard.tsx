interface SiteCardProps {
  href?: string;
  title?: string;
  description?: string;
  preview?: React.ReactNode;
  variant?: "default" | "empty" | "wip";
}

import { SquareArrowOutUpRight, Hammer } from 'lucide-react';
import { useState } from 'react';

export function SiteCard({
  href,
  title,
  description,
  preview,
  variant = "default",
}: SiteCardProps) {
  const isEmpty = variant === "empty";
  const isWip = variant === "wip";
  const [showTooltip, setShowTooltip] = useState(false);

  const Wrapper = isEmpty || isWip ? "div" : "a";

  return (
    <div className="relative">
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
          <div className="rounded-xl border-2 border-white/20 border-dashed bg-white/5 backdrop-blur-sm transition hover:bg-white/10 overflow-hidden">
            <div className="flex flex-col items-center justify-center aspect-video text-white/30">
              <p className="text-sm">What will your site be?</p>
            </div>
          </div>
        ) : (
          <div 
            className={`rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition overflow-hidden ${
              isWip 
                ? "hover:opacity-50" 
                : "hover:bg-white/10"
            }`}
          >
            <div className='flex w-full flex-row p-6 justify-between items-center'>
              <div>
                <p className="text-lg text-white/90 font-medium">{title}</p>
                <p className="text-sm text-white/50 mt-2">{description}</p>
              </div>
              {isWip ? (
                <Hammer/>
              ) : (
                <SquareArrowOutUpRight />
              )}
            </div>
          </div>
        )}
      </Wrapper>

      {/* WIP Tooltip */}
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