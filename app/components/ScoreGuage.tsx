import { useEffect, useRef, useState } from "react";

interface ScoreGaugeProps {
  score: number; // 0–10 scale
  maxScore?: number;
}

const ScoreGauge = ({ score = 0, maxScore = 10 }: ScoreGaugeProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [offset, setOffset] = useState(0);

  const percentage = Math.max(0, Math.min(score / maxScore, 1)); // Clamp 0–1

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setOffset(length * (1 - percentage));
    }
  }, [percentage]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5171FF" />
              <stop offset="100%" stopColor="#FF97AD" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-semibold pt-4">{score}/{maxScore}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
                                                   