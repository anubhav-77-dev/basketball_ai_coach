import React from "react";

const DribblingBasketball: React.FC = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="relative h-24 w-24">
      {/* Shadow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-2 w-16 h-4 rounded-full bg-black/30 blur-sm"
        style={{
          animation: "shadowDribble 0.6s infinite cubic-bezier(.4,0,.2,1)",
        }}
      />
      {/* Basketball */}
      <svg
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 0,
          width: "64px",
          height: "64px",
          animation: "dribble 0.6s infinite cubic-bezier(.4,0,.2,1)",
        }}
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle cx="32" cy="32" r="30" fill="#F97316" stroke="#EA580C" strokeWidth="4" />
        <path d="M32 2v60M2 32h60" stroke="#EA580C" strokeWidth="3" />
        <path d="M12 12c16 16 24 24 40 40M52 12C36 28 28 36 12 52" stroke="#EA580C" strokeWidth="2" />
      </svg>
    </div>
    <style>
      {`
        @keyframes dribble {
          0% { transform: translate(-50%, 0); }
          20% { transform: translate(-50%, 10px); }
          40% { transform: translate(-50%, 32px); }
          50% { transform: translate(-50%, 40px); }
          60% { transform: translate(-50%, 32px); }
          80% { transform: translate(-50%, 10px); }
          100% { transform: translate(-50%, 0); }
        }
        @keyframes shadowDribble {
          0% { width: 64px; opacity: 0.5; }
          40% { width: 90px; opacity: 0.2; }
          50% { width: 100px; opacity: 0.1; }
          60% { width: 90px; opacity: 0.2; }
          100% { width: 64px; opacity: 0.5; }
        }
      `}
    </style>
  </div>
);

export default DribblingBasketball; 