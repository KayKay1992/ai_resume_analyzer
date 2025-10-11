import { prepareInstructions } from "../../constants";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    // Handle file selection logic here
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
    //upload the file to puter storage
    const uploadFile = await fs.upload([file]);
    //if there is no uploaded file
    if (!uploadFile)
      return setStatusText("Error: Failed to upload file. Please try again.");
    //if we have a file we convert
    setStatusText("Converting to Image...");
    const imageFile = await convertPdfToImage(file);

    //check if imag file exist
    if (!imageFile.file)
      return setStatusText(
        "Error: Failed to convert PDF to image. Please try again."
      );

    //updating the status
    setStatusText("Uploading Image...");

    //upload image to puter storage
    const uploadedImage = await fs.upload([imageFile.file]);

    //check if we have uploaded image
    if (!uploadedImage)
      return setStatusText("Error: Failed to upload image. Please try again.");

    //update status
    setStatusText("Getting AI Analysis...");

    //generate uuid for Ai Analysis
    const uuid = generateUUID();

    //formating all the data using uuid
    const data = {
      id: uuid,
      resumePath: uploadFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    //saving the formatted data on puter storage
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    //Status update
    setStatusText("Getting AI Analysis...");

    //getting AI analysis
    const feedback = await ai.feedback(
      uploadFile.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat: "JSON",
      })
    );

    //if we dont get feedback
    if (!feedback)
      return setStatusText("Error: Failed to get AI analysis. Please try again.");

    //if we got a fedback then we extract the feedback text
    const feedbackText = typeof feedback.message.content === "string"
      ? feedback.message.content
      : feedback.message.content[0].text;

    //parsing the feedback text to json
    data.feedback = JSON.parse(feedbackText);

    //updating the data on puter storage with feedback
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    //Status update
    setStatusText("Analysis complete! Redirecting...");
    console.log( data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle file upload logic here
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name")?.toString() || "";
    const jobTitle = formData.get("job-title")?.toString() || "";
    const jobDescription = formData.get("job-description")?.toString() || "";

    if (!file) return;

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
