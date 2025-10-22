import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

interface FeedbackRaw {
  overall_rating?: number;
  ats_compatibility?: { rating?: number; score?: number; issues?: string[] };
  job_match?: { rating?: number; alignment?: string[] };
  formatting_suggestions?: string[];
  keyword_optimization?: {
    missing_keywords?: string[];
    suggested_additions?: string[];
  };
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  gaps?: string[];
  [key: string]: any;
}

interface FeedbackNormalized {
  overall_rating: number;
  ats_compatibility: { rating: number; comments: string };
  alignment_with_job: { rating: number; comments: string };
  format_and_design: { rating: number; comments: string };
  content_quality: { rating: number; comments: string };
  work_experience: { rating: number; comments: string };
  education: { rating: number; comments: string };
  skills: { rating: number; comments: string };
  improvement_suggestions: string[];
  final_recommendations: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<FeedbackNormalized | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      // Load resume file
      const resumeBlob = await fs.read(data.resumeUrl || data.resumePath);
      if (resumeBlob) setResumeUrl(URL.createObjectURL(resumeBlob));

      // Load preview image
      const imageBlob = await fs.read(data.imageUrl || data.imagePath);
      if (imageBlob) setImageUrl(URL.createObjectURL(imageBlob));

      const raw: FeedbackRaw = data.feedback;

      // ✅ Normalize backend data to UI-compatible format
      const normalized: FeedbackNormalized = {
        overall_rating: raw?.overall_rating ?? 0,

        ats_compatibility: {
          rating: raw?.ats_compatibility?.rating ?? raw?.ats_compatibility?.score ?? 0,
          comments: raw?.ats_compatibility?.issues
            ? raw.ats_compatibility.issues.join("\n")
            : "",
        },

        alignment_with_job: {
          rating: raw?.job_match?.rating ?? 0,
          comments: raw?.job_match?.alignment
            ? raw.job_match.alignment.join("\n")
            : "",
        },

        format_and_design: {
          rating: raw?.formatting_suggestions ? 7 : 0,
          comments: raw?.formatting_suggestions
            ? raw.formatting_suggestions.join("\n")
            : "",
        },

        content_quality: {
          rating: raw?.job_match?.rating ?? 0,
          comments: [
            ...(raw?.strengths ?? []),
            ...(raw?.weaknesses ?? []),
          ].join("\n"),
        },

        work_experience: {
          rating: raw?.job_match?.rating ?? 0,
          comments: raw?.gaps ? raw.gaps.join("\n") : "",
        },

        education: {
          rating: 7, // fallback
          comments: "",
        },

        skills: {
          rating: raw?.keyword_optimization?.missing_keywords?.length
            ? 10 - raw.keyword_optimization.missing_keywords.length
            : 0,
          comments: raw?.keyword_optimization?.suggested_additions
            ? raw.keyword_optimization.suggested_additions.join("\n")
            : "",
        },

        improvement_suggestions: raw?.recommendations ?? [],
        final_recommendations: raw?.recommendations
          ? raw.recommendations.join("\n")
          : "",
        summary: `Your resume scored ${raw?.overall_rating ?? 0}/10 based on multiple evaluation categories.`,
        strengths: raw?.strengths ?? [],
        weaknesses: raw?.weaknesses ?? [],
      };

      setFeedback(normalized);
      console.log("✅ Normalized Feedback:", normalized);
    };

    loadResume();
  }, [id, kv, fs]);

  if (!feedback) {
    return (
      <main className="!pt-0">
        <img src="/images/resume-scan-2.gif" className="w-full" />
      </main>
    );
  }

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Left: Resume Preview */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border h-[90%] w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>

        {/* Right: Feedback Section */}
        <section className="feedback-section">
          <h2 className="text-4xl font-bold text-black">Resume Review</h2>
          <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
            <Summary feedback={feedback} />
            <ATS
              score={feedback.ats_compatibility.rating}
              suggestions={feedback.improvement_suggestions}
            />
            <Details feedback={feedback} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;
