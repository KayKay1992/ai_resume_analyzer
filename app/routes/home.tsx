import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard, { type Resume } from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
// import type { Resume } from "types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();

  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      console.log("parsedResumes", parsedResumes);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="hero-title">
            Track Your Application and Resume Ratings
          </h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No Resumes Found. Upload Your First Resume</h2>
          ) : (
            <h2 className="hero-subtitle">
              Get real-time feedback on your resume and job applications with
              our AI-powered analyzer. Improve your chances of landing your
              dream job!
            </h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to='/upload' className="primary-button w-fit text-xl font-semibold mt-8">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
