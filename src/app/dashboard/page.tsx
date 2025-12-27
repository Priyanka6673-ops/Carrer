import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentAnalyses } from "@/components/dashboard/recent-analyses";
import {
  Activity,
  Award,
  BarChart,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROFESSIONS } from "@/lib/constants";

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const userName = searchParams?.name as string || 'there';
  const userRole = 'Software Engineer'; // This will be dynamic later

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground">
            Here's a snapshot of your career prep progress for{" "}
            <span className="font-semibold text-primary">{userRole}</span>.
          </p>
        </div>
        <div className="w-full sm:w-auto">
            <Select defaultValue={userRole}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    {PROFESSIONS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Grid for new widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">82%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Coverage</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">75%</div>
            <p className="text-xs text-muted-foreground">vs. target role</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Interview Score</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.1 / 10</div>
            <p className="text-xs text-muted-foreground">+0.5 from last interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Taken</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 this month</p>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strong Areas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">React</span>
            <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">TypeScript</span>
            <span className="text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">System Design</span>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weak Areas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-2">
             <span className="text-xs font-medium bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Kubernetes</span>
             <span className="text-xs font-medium bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Data Structures</span>
             <span className="text-xs font-medium bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Behavioral (STAR)</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
