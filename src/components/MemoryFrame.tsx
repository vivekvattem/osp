import { PageFrame } from "@/types/pageReplacement";
import { cn } from "@/lib/utils";

interface MemoryFrameProps {
  frame: PageFrame;
  frameNumber: number;
  showClock?: boolean;
  isClockPointer?: boolean;
}

export const MemoryFrame = ({ frame, frameNumber, showClock, isClockPointer }: MemoryFrameProps) => {
  return (
    <div className="relative">
      {isClockPointer && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-accent font-bold text-lg animate-bounce">
          ↓
        </div>
      )}
      <div
        className={cn(
          "w-24 h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300",
          "shadow-card hover:shadow-elevated",
          frame.isHit && "border-success bg-success/10 scale-105",
          frame.isNew && !frame.isHit && "border-warning bg-warning/10 scale-105",
          !frame.isHit && !frame.isNew && frame.page !== null && "border-primary bg-card",
          frame.page === null && "border-dashed border-muted bg-muted/30"
        )}
      >
        <div className="text-xs text-muted-foreground mb-1">Frame {frameNumber}</div>
        {frame.page !== null ? (
          <>
            <div className="text-2xl font-bold text-foreground">{frame.page}</div>
            {showClock && frame.referenceBit !== undefined && (
              <div className="text-xs mt-1 text-muted-foreground">
                R: {frame.referenceBit}
              </div>
            )}
          </>
        ) : (
          <div className="text-lg text-muted-foreground">Empty</div>
        )}
      </div>
    </div>
  );
};
