import { PageHeader } from "@/components/page-header";
import { StudyPlanClient } from "@/components/dashboard/study-plan-client";

export default function StudyPlanPage() {
    return (
        <>
            <PageHeader
                title="Personalized Study Plan"
                description="Generate a custom study plan based on your resume and a target job description."
            />
            <StudyPlanClient />
        </>
    );
}
