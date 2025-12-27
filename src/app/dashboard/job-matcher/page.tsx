import { PageHeader } from "@/components/page-header";
import { JobMatcherClient } from "@/components/dashboard/job-matcher-client";

export default function JobMatcherPage() {
    return (
        <>
            <PageHeader
                title="Job Matcher"
                description="See how your resume stacks up against a specific job description."
            />
            <JobMatcherClient />
        </>
    );
}
