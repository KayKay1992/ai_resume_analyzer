import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover">
      <Navbar />
    <section className="main-section">
  <div className="page-heading py-16">
    <h1 className="hero-title">Track Your Application and Resume Ratings</h1>
    <h2 className="hero-subtitle">
      Get real-time feedback on your resume and job applications with our
      AI-powered analyzer. Improve your chances of landing your dream job!
    </h2>
  </div>

  {resumes.length > 0 && (
    <div className="resumes-section">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  )}
</section>

    </main>
  );
}
