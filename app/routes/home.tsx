import type { Route } from "./+types/home";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover">
   <section className="main-section">
    <div className="page-heading">
      <h1 className="hero-title">Track Your Application and Resume ratings</h1>
      <h2 className="hero-subtitle">Get real-time feedback on your resume and job applications with our AI-powered analyzer. Improve your chances of landing your dream job!</h2>
      </div>
   </section>
  </main>;
}
