'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating historical interview questions for a specific technology.
 *
 * - generateHistoricalQuestions - A function to generate the most asked questions over the last 10 years.
 * - GenerateHistoricalQuestionsInput - The input type for the function.
 * - GenerateHistoricalQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHistoricalQuestionsInputSchema = z.object({
  technology: z.string().describe('The technology to generate historical questions for (e.g., "JavaScript", "Terraform").'),
});
type GenerateHistoricalQuestionsInput = z.infer<typeof GenerateHistoricalQuestionsInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The interview question.'),
  topic: z.string().describe('The sub-topic or category the question belongs to (e.g., "Closures", "State Management").'),
});

const GenerateHistoricalQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of the 10-15 most frequently asked interview questions for the given technology over the last decade.'),
});
type GenerateHistoricalQuestionsOutput = z.infer<typeof GenerateHistoricalQuestionsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateHistoricalQuestionsPrompt',
  input: {schema: GenerateHistoricalQuestionsInputSchema},
  output: {schema: GenerateHistoricalQuestionsOutputSchema},
  prompt: `You are an expert technical historian and senior hiring manager for the tech industry.

Your task is to analyze historical trends and generate a list of the 10-15 most frequently asked and fundamental interview questions for the technology '{{technology}}' over the past decade.

These questions should be timeless classics that test core understanding. For each question, identify the specific topic it covers.

Generate the questions in the specified JSON format.
`,
});

const generateHistoricalQuestionsFlow = ai.defineFlow(
  {
    name: 'generateHistoricalQuestionsFlow',
    inputSchema: GenerateHistoricalQuestionsInputSchema,
    outputSchema: GenerateHistoricalQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateHistoricalQuestions(input: GenerateHistoricalQuestionsInput): Promise<GenerateHistoricalQuestionsOutput> {
  return generateHistoricalQuestionsFlow(input);
}
