import React from "react";
import { BasketballIcon } from "./Icons";

interface BasketballProgressBarProps {
  progress: number; // 0 to 1
}

const TRACK_HEIGHT = 16;
const BALL_SIZE = 32;

const BasketballProgressBar: React.FC<BasketballProgressBarProps> = ({ progress }) => {
  // Clamp progress between 0 and 1
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <div className="w-full max-w-lg mx-auto py-4">
      <div
        className="relative bg-gradient-to-r from-orange-200/30 to-orange-500/30 rounded-full"
        style={{ height: TRACK_HEIGHT }}
      >
        {/* Track line */}
        <div
          className="absolute top-1/2 left-0 w-full h-2 bg-orange-900/40 rounded-full"
          style={{ transform: "translateY(-50%)" }}
        />
        {/* Basketball */}
        <div
          className="absolute"
          style={{
            left: `calc(${pct * 100}% - ${BALL_SIZE / 2}px)`,
            top: `-${BALL_SIZE / 2 - TRACK_HEIGHT / 2}px`,
            transition: "left 0.3s cubic-bezier(.4,2,.6,1)",
          }}
        >
          <BasketballIcon className="w-8 h-8 text-orange-400 drop-shadow-lg animate-bounce" />
        </div>
      </div>
      <div className="text-center mt-2 font-bold text-orange-300">
        {Math.round(pct * 100)}%
      </div>
    </div>
  );
};

export default BasketballProgressBar; 