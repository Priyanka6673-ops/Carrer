'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a personalized study plan based on a user's resume, a target job description, and a preparation timeframe.
 *
 * - generateStudyPlan - A function that takes resume text, a job description, and a number of days to generate a tailored study plan.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateStudyPlanInputSchema = z.object({
  resumeText: z.string().describe("The full text content of the user's resume."),
  jobDescription: z.string().describe("The full text of the target job description."),
  days: z.number().int().positive().describe("The number of days the user has to prepare."),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

export const GenerateStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe("A detailed, day-by-day study plan in Markdown format. The plan should identify key skill gaps between the resume and the job description and provide a structured learning path with links to high-quality online resources."),
  suggestedProfession: z.string().describe("The job title extracted or inferred from the job description, which can be used for a mock interview (e.g., 'Senior DevOps Engineer')."),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an expert career coach and technical mentor. Your task is to create a hyper-personalized study plan for a user trying to land a specific job.

You will be given their resume, the target job description, and the number of days they have to prepare.

**Your Analysis Steps:**
1.  **Identify Skill Gaps:** Meticulously compare the skills, technologies, and experiences listed in the resume against the requirements in the job description. Identify the key areas where the user is weakest.
2.  **Prioritize:** Based on the job description, determine which missing skills are most critical and should be prioritized.
3.  **Extract Job Title:** Identify the specific job title from the job description (e.g., "Software Engineer", "Product Manager"). This will be used to suggest a mock interview.
4.  **Create a Study Plan:** Generate a detailed, day-by-day study plan for the specified number of days.
    - The plan must be in Markdown format.
    - Each day should have a clear theme or goal.
    - For each topic, include 1-2 links to high-quality, free online resources (official docs, tutorials, articles, videos).
    - The plan should be realistic for the given timeframe.

**User's Resume:**
---
{{{resumeText}}}
---

**Target Job Description:**
---
{{{jobDescription}}}
---

**Preparation Time:** {{{days}}} days

Now, generate the study plan and suggest the relevant profession for a mock interview.
`,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}
