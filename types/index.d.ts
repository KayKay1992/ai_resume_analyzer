export interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

export interface Tip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

export interface FeedbackCategory {
  score: number; // score out of 10
  tips: Tip[];
}

export interface Feedback {
  overallScore: number;
  ATS: FeedbackCategory; // ATS compatibility feedback
  toneAndStyle: FeedbackCategory; // Language, tone, clarity
  content: FeedbackCategory; // Resume content quality
  structure: FeedbackCategory; // Resume layout/organization
  skills: FeedbackCategory; // Skill match to job
}

export interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}
