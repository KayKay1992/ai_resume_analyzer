import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

export interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string; // should be a valid file path, not a directory
  resumePath: string;
  feedback: {
    overall_rating: number;
  };
}

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>("");

  useEffect(() => {
    const loadResume = async () => {
      if (!imagePath || imagePath.endsWith("/")) {
        console.warn("Invalid imagePath (directory or missing):", imagePath);
        return;
      }

      try {
        const blob = await fs.read(imagePath);

        // if Puter returns null/undefined, skip
        if (!blob) {
          console.warn("No blob found for image:", imagePath);
          return;
        }

        // create temporary object URL for the image blob
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (err: any) {
        console.error("Error reading image file:", err.message);
      }
    };

    loadResume();

    // cleanup to revoke URL when unmounted
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName ? (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          ) : (
            <h2 className="!text-black font-bold">Resume</h2>
          )}

          {jobTitle && (
            <h3 className="text-lg text-gray-500 break-words">{jobTitle}</h3>
          )}
        </div>

        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overall_rating ?? 0} />
        </div>
      </div>

      {resumeUrl ? (
        <div className="gradient-border animate-in fade-in duration-1000">
          <img
            src={resumeUrl}
            alt="resume"
            className="w-full h-[350px] max-sm:h-[350px] object-cover object-top rounded-2xl"
          />
        </div>
      ) : (
        <div className="h-[350px] flex items-center justify-center text-gray-400 border border-dashed rounded-2xl">
          No preview available
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
