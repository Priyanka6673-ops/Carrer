'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized dashboard summary 
 * based on a user's resume and target profession.
 *
 * - generateDashboardSummary: A function that returns a comprehensive career readiness analysis.
 * - GenerateDashboardSummaryInput: The input type for the function.
 * - GenerateDashboardSummaryOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateDashboardSummaryInputSchema = z.object({
  resumeText: z.string().describe('The full text content of the user\'s resume.'),
  profession: z.string().describe('The user\'s target job role (e.g., "Software Engineer").'),
});
export type GenerateDashboardSummaryInput = z.infer<typeof GenerateDashboardSummaryInputSchema>;

export const GenerateDashboardSummaryOutputSchema = z.object({
  targetRole: z.string().describe("The user's target role, as provided in the input."),
  readinessScore: z.number().int().min(0).max(100).describe('An overall "job readiness" score from 0-100, calculated based on skill alignment and estimated experience.'),
  skillsCoverage: z.number().int().min(0).max(100).describe('The percentage of required skills for the target role that are present in the resume.'),
  strongAreas: z.array(z.string()).describe('The top 3-4 skills or technologies where the user shows strong proficiency.'),
  weakAreas: z.array(z.string()).describe('The top 3-4 most critical skills that are missing or weak for the target role.'),
  interviewsTaken: z.number().int().min(0).describe('A simulated number of interviews taken. Generate a random number between 5 and 25.'),
  averageInterviewScore: z.number().min(0).max(10).describe('A simulated average score from past mock interviews. Generate a random number between 6.5 and 9.5 with one decimal place.'),
});
export type GenerateDashboardSummaryOutput = z.infer<typeof GenerateDashboardSummaryOutputSchema>;

export async function generateDashboardSummary(input: GenerateDashboardSummaryInput): Promise<GenerateDashboardSummaryOutput> {
  return generateDashboardSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDashboardSummaryPrompt',
  input: {schema: GenerateDashboardSummaryInputSchema},
  output: {schema: GenerateDashboardSummaryOutputSchema},
  prompt: `You are an expert career analyst and AI dashboard generator for a platform called CareerCraft AI.
Your task is to analyze a user's resume against their stated target profession and generate a JSON object summarizing their career readiness.

**User's Target Role:** {{{profession}}}
**User's Resume:**
\`\`\`
{{{resumeText}}}
\`\`\`

**Your Analysis Must Cover:**
1.  **Skills Analysis:** Identify the key skills, technologies, and methodologies present in the resume. Compare them against the typical requirements for a mid-level {{{profession}}}.
2.  **Readiness Score (0-100):** Synthesize all factors to create a holistic "job readiness" score. A junior profile applying for a senior role should have a lower score, while a perfect match should be high.
3.  **Skills Coverage (0-100):** Calculate the percentage of required skills for the role that the user possesses.
4.  **Strengths & Weaknesses:** Identify the top 3-4 strongest skills and the top 3-4 most critical missing skills.
5.  **Simulated Data:** Generate a plausible random number for "interviewsTaken" (between 5 and 25) and "averageInterviewScore" (a float between 6.5 and 9.5).

Return the data in the specified JSON format.
`,
});

const generateDashboardSummaryFlow = ai.defineFlow(
  {
    name: 'generateDashboardSummaryFlow',
    inputSchema: GenerateDashboardSummaryInputSchema,
    outputSchema: GenerateDashboardSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
