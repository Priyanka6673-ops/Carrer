import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const userName = searchParams?.name as string || 'there';
  
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Get started by pasting your resume below to generate your career dashboard.
          </p>
        </div>
      </div>

      <DashboardClient />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Your mock interview scores over the last 7 sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>An overview of your recent actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAnalyses />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
