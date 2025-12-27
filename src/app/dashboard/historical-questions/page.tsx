import { PageHeader } from "@/components/page-header";
import { HistoricalQuestionsClient } from "@/components/dashboard/historical-questions-client";

export default function HistoricalQuestionsPage() {
    return (
        <>
            <PageHeader
                title="Past Interview Questions"
                description="Get the most frequently asked questions for any technology over the last decade."
            />
            <HistoricalQuestionsClient />
        </>
    );
}
