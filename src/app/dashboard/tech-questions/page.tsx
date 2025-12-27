import { PageHeader } from "@/components/page-header";
import { TechQuestionsClient } from "@/components/dashboard/tech-questions-client";

export default function TechQuestionsPage() {
    return (
        <>
            <PageHeader
                title="Technical Questions"
                description="Get theoretical and practical questions for specific technologies to test your knowledge."
            />
            <TechQuestionsClient />
        </>
    );
}
