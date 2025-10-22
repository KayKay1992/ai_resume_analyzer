interface ScoreCircleProps {
  score: number; // 0–10
  maxScore?: number;
}

const ScoreCircle = ({ score = 0, maxScore = 10 }: ScoreCircleProps) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / maxScore;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-[100px] h-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5171FF" />
            <stop offset="100%" stopColor="#FF97AD" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Score Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold text-sm">
          {score}/{maxScore}
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;
