'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Target, Award, BarChart, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PROFESSIONS } from '@/lib/constants';
import { generateDashboardSummary, type GenerateDashboardSummaryOutput } from '@/ai/flows/generate-dashboard-summary';

async function generateDashboardAction(prevState: any, formData: FormData): Promise<{ result: GenerateDashboardSummaryOutput | null; error: string | null; }> {
    const resumeText = formData.get('resumeText') as string;
    const profession = formData.get('profession') as string;
    
    if (!resumeText || resumeText.trim().length < 50) {
        return { result: null, error: "Please enter at least 50 characters of your resume." };
    }
     if (!profession) {
        return { result: null, error: "Please select a target profession." };
    }

    try {
        const result = await generateDashboardSummary({ resumeText, profession });
        return { result, error: null };
    } catch (e) {
        console.error(e);
        return { result: null, error: "An error occurred during analysis. Please try again." };
    }
}


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {pending ? 'Generating Dashboard...' : 'Generate Dashboard'}
        </Button>
    );
}

export function DashboardClient() {
    const { toast } = useToast();
    const [state, formAction] = useFormState(generateDashboardAction, { result: null, error: null });
    const [selectedProfession, setSelectedProfession] = useState(PROFESSIONS[0]);
    
    if (state.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: state.error,
        });
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="pt-6">
                    <form action={formAction} className="space-y-4">
                        <Textarea
                            name="resumeText"
                            placeholder="Paste the full text of your resume here to generate your personalized dashboard..."
                            className="min-h-[150px] text-base"
                            required
                        />
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="w-full sm:w-auto sm:flex-1">
                                <Select name="profession" value={selectedProfession} onValueChange={setSelectedProfession}>
                                    <SelectTrigger className="w-full sm:w-[280px]">
                                        <SelectValue placeholder="Select a target role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROFESSIONS.map((p) => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                             </div>
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>

            {state.result && (
                <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{state.result.readinessScore}%</div>
                                <p className="text-xs text-muted-foreground">For a {state.result.targetRole} role</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Skills Coverage</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{state.result.skillsCoverage}%</div>
                                <p className="text-xs text-muted-foreground">vs. target role</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg. Interview Score</CardTitle>
                                <BarChart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{state.result.averageInterviewScore} / 10</div>
                                <p className="text-xs text-muted-foreground">Based on {state.result.interviewsTaken} interviews</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Interviews Taken</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{state.result.interviewsTaken}</div>
                                <p className="text-xs text-muted-foreground">Keep practicing!</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Strong Areas</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 pt-2">
                                {state.result.strongAreas.map(skill => (
                                    <span key={skill} className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{skill}</span>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2 pt-2">
                                {state.result.weakAreas.map(skill => (
                                    <span key={skill} className="text-xs font-medium bg-red-500/20 text-red-400 px-2 py-1 rounded-full">{skill}</span>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
