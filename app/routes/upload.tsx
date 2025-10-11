import React, { useState } from "react";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";

const Upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    // Handle file selection logic here
    setFile(file);

  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle file upload logic here
   const form = e.currentTarget.closest('form')
   if(!form || !file) return;
   const formData = new FormData(form)
   const companyName = formData.get('company-name')?.toString() || ''
   const jobTitle = formData.get('job-title')?.toString() || ''
   const jobDescription = formData.get('job-description')?.toString() || ''

    console.log({companyName, jobTitle, jobDescription, file})
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setStatusText("Upload complete! You can view your analysis on the home page.");
    }, 3000);
    };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-no-repeat bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>
              Upload your resume and job description to get started. Our
              AI-powered analyzer will provide you with real-time feedback to
              improve your chances of landing your dream job with ATS score and
              improvement tips!
            </h2>
          )}
          {
            !isProcessing && (
              <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                <div className="form-div">
                    <label htmlFor="company-name">Company Name</label>
                    <input type="text" id="company-name" name="company-name" placeholder="Company Name"/>
                </div>
                <div className="form-div">
                    <label htmlFor="job-title">Job Title</label>
                    <input type="text" id="job-title" name="job-title" placeholder="Job Title"/>
                </div>
                <div className="form-div">
                    <label htmlFor="job-description">Job Description</label>
                    <textarea rows={5} id="job-description" name="job-description" placeholder="Job Description"/>
                </div>
                <div className="form-div">
                    <label htmlFor="uploader">Upload CV</label>
                 <FileUploader onFileSelect={handleFileSelect}/>
                </div>
                <button className="primary-button" type="submit">
                    {isProcessing ? "Processing..." : "Upload"}
                </button>
              </form>
            )
          }
        </div>
      </section>
    </main>
  );
};

export default Upload;
