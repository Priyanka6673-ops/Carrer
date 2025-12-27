import { PageHeader } from "@/components/page-header";
import { RoadmapClient } from "@/components/dashboard/roadmap-client";

export default function RoadmapsPage() {
    return (
        <>
            <PageHeader
                title="Career Roadmaps"
                description="Choose a profession to generate a comprehensive learning roadmap, from beginner to pro."
            />
            <RoadmapClient />
        </>
    );
}
