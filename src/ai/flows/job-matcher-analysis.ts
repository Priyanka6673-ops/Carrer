'use server';

/**
 * @fileOverview This file defines a Genkit flow for matching a user's resume against a job description.
 *
 * - analyzeJobMatch - Analyzes a resume and job description to provide a match score, feedback, and a study plan.
 * - JobMatchAnalysisInput - Input type for the flow.
 * - JobMatchAnalysisOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMatchAnalysisInputSchema = z.object({
  resumeText: z.string().describe("The full text content of the user's resume."),
  jobDescription: z.string().describe("The full text of the target job description."),
});
export type JobMatchAnalysisInput = z.infer<typeof JobMatchAnalysisInputSchema>;

const JobMatchAnalysisOutputSchema = z.object({
  matchScore: z.number().int().min(0).max(100).describe("A percentage score representing how well the resume matches the job description."),
  strongAreas: z.array(z.string()).describe("A list of key skills and experiences from the resume that are a strong match for the job."),
  improvementAreas: z.array(z.string()).describe("A list of key skills or requirements from the job description that are missing or weak in the resume."),
  targetedStudyPlan: z.string().describe("A concise, targeted study plan in Markdown format, focused on bridging the most critical skill gaps identified. It should include links to relevant, high-quality learning resources."),
});
export type JobMatchAnalysisOutput = z.infer<typeof JobMatchAnalysisOutputSchema>;

const prompt = ai.definePrompt({
  name: 'jobMatchAnalysisPrompt',
  input: {schema: JobMatchAnalysisInputSchema},
  output: {schema: JobMatchAnalysisOutputSchema},
  prompt: `You are an expert career coach and technical recruiter. Your task is to perform a detailed analysis of a user's resume against a target job description.

**Analysis Steps:**
1.  **Comprehensive Comparison:** Meticulously compare the skills, technologies, and experiences in the resume with the requirements in the job description.
2.  **Calculate Match Score:** Based on the comparison, calculate a match score from 0 to 100. A score of 100 means a perfect match.
3.  **Identify Strong Areas:** Pinpoint the top 3-5 areas where the user's experience is a strong fit for the job requirements.
4.  **Identify Improvement Areas:** Identify the top 3-5 most critical skill gaps or missing requirements.
5.  **Create Targeted Study Plan:** Generate a brief but actionable study plan in Markdown format. This plan should focus *only* on the identified improvement areas and provide 1-2 high-quality online resource links for each.

**User's Resume:**
---
{{{resumeText}}}
---

**Target Job Description:**
---
{{{jobDescription}}}
---

Now, perform the analysis and return the results in the specified JSON format.
`,
});

const jobMatchAnalysisFlow = ai.defineFlow(
  {
    name: 'jobMatchAnalysisFlow',
    inputSchema: JobMatchAnalysisInputSchema,
    outputSchema: JobMatchAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function analyzeJobMatch(input: JobMatchAnalysisInput): Promise<JobMatchAnalysisOutput> {
  return jobMatchAnalysisFlow(input);
}
