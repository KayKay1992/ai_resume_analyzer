import React from "react";
import ScoreBadge from "~/components/ScoreBadge";
import ScoreGauge from "./ScoreGuage";
import type { Feedback } from "./Details";

interface FeedbackSummaryProps {
  feedback: Feedback;
}

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score >= 7
      ? "text-green-600"
      : score >= 5
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary text-center py-2">
      <div className="flex flex-row gap-2 items-center justify-center">
        <p className="text-lg font-medium">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="text-lg">
        <span className={textColor}>{score}</span>/10
      </p>
    </div>
  );
};

const Summary: React.FC<FeedbackSummaryProps> = ({ feedback }) => {
  const categories = [
    { title: "Tone & Style", score: feedback.format_and_design?.rating ?? 0 },
    { title: "Content Quality", score: feedback.content_quality?.rating ?? 0 },
    { title: "Structure & Format", score: feedback.work_experience?.rating ?? 0 },
    { title: "Skill Match", score: feedback.skills?.rating ?? 0 },
    { title: "ATS Compatibility", score: feedback.ats_compatibility?.rating ?? 0 },
    { title: "Relevance to Work", score: feedback.alignment_with_job?.rating ?? 0 },
    { title: "Education", score: feedback.education?.rating ?? 0 },
  ];

  const filteredCategories = categories.filter((cat) => cat.score > 0);

  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 flex flex-col gap-6">
      {/* Overall Score */}
      <div className="flex flex-row items-center gap-8">
        <ScoreGauge score={feedback.overall_rating} maxScore={10} />
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            Scored out of 10 based on multiple evaluation categories.
          </p>
        </div>
      </div>

      {/* Score Categories */}
      {filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((cat) => (
            <Category key={cat.title} title={cat.title} score={cat.score} />
          ))}
        </div>
      )}

      {/* Summary */}
      {feedback.summary && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-700">{feedback.summary}</p>
        </div>
      )}

      {/* Strengths */}
      {(feedback.strengths ?? []).length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Strengths</h3>
          <ul className="list-disc list-inside text-gray-700">
            {(feedback.strengths ?? []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {(feedback.weaknesses ?? []).length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Weaknesses</h3>
          <ul className="list-disc list-inside text-gray-700">
            {(feedback.weaknesses ?? []).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Final Recommendations */}
      {feedback.final_recommendations && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Final Recommendations</h3>
          <p className="text-gray-700">{feedback.final_recommendations}</p>
        </div>
      )}
    </div>
  );
};

export default Summary;
