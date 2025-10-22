import React from "react";

interface ATSProps {
  score: number; // out of 10
  suggestions?: string[]; // make optional
}

const ATS: React.FC<ATSProps> = ({ score, suggestions = [] }) => {
  // Clamp score to 0-10
  const safeScore = Math.max(0, Math.min(score, 10));

  // Hide component entirely if score is 0 and no suggestions
  if (safeScore === 0 && suggestions.length === 0) return null;

  const gradientClass =
    safeScore >= 7
      ? "from-green-100"
      : safeScore >= 5
      ? "from-yellow-100"
      : "from-red-100";

  const iconSrc =
    safeScore >= 7
      ? "/icons/ats-good.svg"
      : safeScore >= 5
      ? "/icons/ats-warning.svg"
      : "/icons/ats-bad.svg";

  const subtitle =
    safeScore >= 7
      ? "Excellent Match!"
      : safeScore >= 5
      ? "Good Start"
      : "Needs Improvement";

  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={iconSrc}
          alt={`ATS Score Icon - ${safeScore}/10`}
          className="w-12 h-12"
        />
        <div>
          <h2 className="text-2xl font-bold">ATS Compatibility - {safeScore}/10</h2>
          <p className="text-gray-600 text-sm">
            This score reflects how well your resume performs in Applicant Tracking Systems (ATS).
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>

      {suggestions.length > 0 ? (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {suggestions.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No suggestions found.</p>
      )}
    </div>
  );
};

export default ATS;
