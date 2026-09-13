package com.hirena.cv.analysis.prompt;

import org.springframework.stereotype.Component;

@Component
public class GeminiPromptBuilder {
    public String build(String cvText, String jobDescription) {
        return """
                You are an ATS and recruitment analysis assistant.

                Analyze the candidate CV against the provided Job Description.
                Evaluate Skills (40%%), Experience (25%%), Responsibilities (20%%),
                Education (10%%), and Certifications (5%%).

                Use ONLY information provided in the CV and Job Description.
                Never invent experience, skills, education, or certifications.
                Consider semantic equivalents where appropriate. Missing information
                must be treated as missing. This is an assistive analysis, not an
                automatic hiring decision.

                Return ONLY valid JSON. Do not use Markdown or code fences.
                Return exactly these fields:
                {
                  "score": 0,
                  "matchedSkills": [],
                  "missingSkills": [],
                  "experienceMatch": 0,
                  "matchedResponsibilities": [],
                  "missingResponsibilities": [],
                  "recommendations": [],
                  "summary": ""
                }

                CV:
                %s

                JOB DESCRIPTION:
                %s
                """.formatted(cvText, jobDescription);
    }
}
