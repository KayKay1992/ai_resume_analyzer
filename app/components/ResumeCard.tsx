import React from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: {
    overall_rating: number;
  };
}

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg text-gray-500 break-words">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overall_rating ?? 0} />
        </div>
      </div>

      <div className="gradient-border animate-in fade-in duration-1000">
        <img
          src={imagePath}
          alt="resume"
          className="w-full h-[350px] max-sm:h-[350px] object-cover object-top rounded-2xl"
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
