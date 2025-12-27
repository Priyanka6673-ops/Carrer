'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a beginner-friendly roadmap for a specific profession.
 *
 * - generateRoadmap - A function to generate a detailed learning roadmap.
 * - GenerateRoadmapInput - The input type for the function.
 * - GenerateRoadmapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoadmapInputSchema = z.object({
  profession: z.string().describe('The profession to generate a roadmap for (e.g., "DevOps Engineer", "Frontend Developer").'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;


const GenerateRoadmapOutputSchema = z.object({
  roadmap: z.string().describe("A detailed, step-by-step roadmap in Markdown format. It should be structured for a beginner, covering fundamental concepts to advanced topics, and include links to high-quality, free online learning resources."),
});
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: {schema: GenerateRoadmapInputSchema},
  output: {schema: GenerateRoadmapOutputSchema},
  prompt: `You are an expert career mentor and senior engineer who specializes in creating learning roadmaps for beginners.

Your task is to generate a comprehensive, step-by-step learning roadmap for a student or beginner looking to become a '{{profession}}'.

**Roadmap Requirements:**
1.  **Structure:** The roadmap must be well-structured and easy to follow. Use headings, subheadings, and lists. The output must be in Markdown format.
2.  **Beginner-Friendly:** Start with the absolute fundamentals. Assume the user has little to no prior knowledge in the field.
3.  **Progression:** Logically progress from beginner to intermediate and advanced topics.
4.  **Key Topics:** Cover all essential technologies, tools, and concepts required for the profession.
5.  **Resources:** For each major topic or technology, provide 1-2 links to high-quality, reputable, and free online resources (e.g., official documentation, free courses, in-depth tutorials, articles).

Generate the roadmap for the '{{profession}}' profession.
`,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}
