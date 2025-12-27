'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, History } from 'lucide-react';
import { generateHistoricalQuestions, type GenerateHistoricalQuestionsOutput } from '@/ai/flows/generate-historical-questions';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

type ActionResult = {
    result: GenerateHistoricalQuestionsOutput | null;
    error: string | null;
};

async function generateQuestionsAction(prevState: any, formData: FormData): Promise<ActionResult> {
    const technology = formData.get('technology') as string;

    if (!technology || technology.trim().length === 0) {
        return { result: null, error: "Please enter a technology." };
    }

    try {
        const result = await generateHistoricalQuestions({ technology });
        return { result, error: null };
    } catch (e) {
        console.error(e);
        return { result: null, error: "An error occurred while generating questions. Please try again." };
    }
}


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
            {pending ? 'Digging up questions...' : 'Get Past Questions'}
        </Button>
    );
}

export function HistoricalQuestionsClient() {
    const { toast } = useToast();
    const [state, formAction] = useActionState(generateQuestionsAction, { result: null, error: null });
    const [technology, setTechnology] = useState('');

    useEffect(() => {
        if (state.error) {
            toast({
              variant: "destructive",
              title: "Generation Failed",
              description: state.error,
            });
        }
    }, [state.error, toast]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Find Historical Questions</CardTitle>
                    <CardDescription>Enter a technology to find its most asked questions from the last 10 years.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form action={formAction} className="flex flex-wrap items-end gap-4">
                        <div className="grid gap-2 flex-1 min-w-[200px]">
                            <Label htmlFor="technology">Technology</Label>
                            <Input
                                id="technology"
                                name="technology"
                                value={technology}
                                onChange={(e) => setTechnology(e.target.value)}
                                placeholder="e.g., Terraform, React, SQL"
                                required
                            />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>

            {state.result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top Questions for {technology}</CardTitle>
                        <CardDescription>Here are the most common questions from the last decade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {state.result.questions.map((q, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                           <span className="text-left flex-1">{q.question}</span>
                                           <Badge variant="secondary">{q.topic}</Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-muted-foreground">
                                            This is a foundational question covering the topic of <span className="font-semibold">{q.topic}</span>. Ensure you can explain the core concepts clearly.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
