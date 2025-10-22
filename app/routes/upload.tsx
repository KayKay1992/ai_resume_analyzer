import { prepareInstructions } from "../../constants";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

interface AIResponse {
  success?: boolean;
  error?: {
    message: string;
  };
  message?: {
    role: string;
    content: string | Array<{ text: string }>;
  };
}

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Analyzing your resume...");
    try {
      // Upload the file to puter storage
      const uploadFile = await fs.upload([file]);
      if (!uploadFile) {
        throw new Error("Failed to upload file.");
      }

      setStatusText("Converting to Image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) {
        throw new Error("Failed to convert PDF to image.");
      }

      setStatusText("Uploading Image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) {
        throw new Error("Failed to upload image.");
      }

      setStatusText("Getting AI Analysis...");
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      // AI feedback call with error handling
      let feedbackResponse: AIResponse | undefined;
      try {
        feedbackResponse = await ai.feedback(
          uploadFile.path,
          prepareInstructions({
            jobTitle,
            jobDescription,
            AIResponseFormat: "JSON",
          })
        );
      } catch (apiError: unknown) {
        let apiErrorMessage = "Failed to get AI response. This may be due to usage limits on the Puter AI service.";
        if (apiError instanceof Error) {
          apiErrorMessage = apiError.message;
        } else if (typeof apiError === 'string') {
          apiErrorMessage = apiError;
        }
        console.error("AI API error:", apiError);
        throw new Error(apiErrorMessage);
      }

      if (!feedbackResponse) {
        let responseErrorMessage = "AI analysis returned no response. This may be due to usage limits.";
        console.error("AI feedback failed: No response");
        throw new Error(responseErrorMessage);
      }

      // Check if the response indicates failure
      if (feedbackResponse.success === false) {
        let responseErrorMessage = "AI analysis returned an error. This may be due to usage limits.";
        if (feedbackResponse?.error?.message) {
          responseErrorMessage = feedbackResponse.error.message;
        }
        console.error("AI feedback failed:", feedbackResponse?.error);
        throw new Error(responseErrorMessage);
      }

      const feedbackText =
        typeof feedbackResponse.message?.content === "string"
          ? feedbackResponse.message.content
          : feedbackResponse.message?.content?.[0]?.text ?? "";

      data.feedback = JSON.parse(feedbackText);
      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete! Redirecting...");
      console.log(data);
      navigate(`/resume/${uuid}`);
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error("Error in handleAnalyze:", error);
      setStatusText(`Error: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const companyName = formData.get("company-name")?.toString() || "";
    const jobTitle = formData.get("job-title")?.toString() || "";
    const jobDescription = formData.get("job-description")?.toString() || "";

    if (!file) {
      setStatusText("Error: No file selected.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
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
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  id="company-name"
                  name="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  id="job-title"
                  name="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  id="job-description"
                  name="job-description"
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload CV</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>
              <button className="primary-button" type="submit">
                {isProcessing ? "Processing..." : "Upload"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
