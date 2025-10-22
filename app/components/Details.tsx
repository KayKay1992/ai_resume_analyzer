import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent,
} from "./Accordion";

interface FeedbackSection {
  rating?: number;
  comments?: string;
}

export interface Feedback {
  overall_rating: number;
  ats_compatibility: FeedbackSection;
  content_quality: FeedbackSection;
  format_and_design: FeedbackSection;
  work_experience?: FeedbackSection;
  education?: FeedbackSection;
  alignment_with_job: FeedbackSection;
  skills?: FeedbackSection;
  improvement_suggestions?: string[];
  final_recommendations?: string;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

interface DetailsProps {
  feedback: Feedback;
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
  const sections = [
    { title: "ATS Compatibility", key: "ats_compatibility" },
    { title: "Content Quality", key: "content_quality" },
    { title: "Format & Design", key: "format_and_design" },
    { title: "Work Experience", key: "work_experience" },
    { title: "Education", key: "education" },
    { title: "Skills", key: "skills" },
    { title: "Relevance to Work", key: "alignment_with_job" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Main Accordion for detailed feedback */}
      <Accordion allowMultiple defaultOpen="ats_compatibility">
        {sections.map((section) => {
          const data: FeedbackSection = feedback[section.key] || {
            rating: 0,
            comments: "",
          };
          const score = data.rating ?? 0;
          const comments = data.comments?.trim();

          // Skip section if score is 0 and no comments
          if (score === 0 && !comments) return null;

          return (
            <AccordionItem key={section.key} id={section.key}>
              <AccordionHeader itemId={section.key}>
                {section.title}
              </AccordionHeader>
              <AccordionContent itemId={section.key}>
                <p className="text-sm text-gray-600 mb-2">Score: {score} / 10</p>
                {comments ? (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comments}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    No comment available
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Strengths */}
      {(feedback.strengths ?? []).length > 0 && (
        <Accordion className="mt-4" allowMultiple>
          <AccordionItem id="strengths">
            <AccordionHeader itemId="strengths">Strengths</AccordionHeader>
            <AccordionContent itemId="strengths">
              <ul className="list-disc pl-5 space-y-1">
                {(feedback.strengths ?? []).map((s, i) => (
                  <li key={i} className="text-gray-700">
                    {s}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Weaknesses */}
      {(feedback.weaknesses ?? []).length > 0 && (
        <Accordion allowMultiple>
          <AccordionItem id="weaknesses">
            <AccordionHeader itemId="weaknesses">Weaknesses</AccordionHeader>
            <AccordionContent itemId="weaknesses">
              <ul className="list-disc pl-5 space-y-1">
                {(feedback.weaknesses ?? []).map((w, i) => (
                  <li key={i} className="text-gray-700">
                    {w}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Improvement Suggestions */}
      {(feedback.improvement_suggestions ?? []).length > 0 && (
        <Accordion allowMultiple>
          <AccordionItem id="suggestions">
            <AccordionHeader itemId="suggestions">
              Improvement Suggestions
            </AccordionHeader>
            <AccordionContent itemId="suggestions">
              <ul className="list-disc pl-5 space-y-1">
                {(feedback.improvement_suggestions ?? []).map((tip, i) => (
                  <li key={i} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Final Recommendations */}
      {feedback.final_recommendations && (
        <Accordion allowMultiple>
          <AccordionItem id="recommendations">
            <AccordionHeader itemId="recommendations">
              Final Recommendations
            </AccordionHeader>
            <AccordionContent itemId="recommendations">
              <p className="text-gray-700 whitespace-pre-wrap">
                {feedback.final_recommendations}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Summary */}
      {feedback.summary && (
        <Accordion allowMultiple>
          <AccordionItem id="summary">
            <AccordionHeader itemId="summary">Summary</AccordionHeader>
            <AccordionContent itemId="summary">
              <p className="text-gray-700 whitespace-pre-wrap">
                {feedback.summary}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default Details;
