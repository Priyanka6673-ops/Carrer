"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Settings,
  CalendarDays,
  Code,
  GitCompareArrows,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileText },
  { href: "/dashboard/study-plan", label: "Study Plan", icon: CalendarDays },
  { href: "/dashboard/tech-questions", label: "Tech Questions", icon: Code },
  { href: "/dashboard/job-matcher", label: "Job Matcher", icon: GitCompareArrows },
  { href: "/dashboard/mock-interview", label: "Mock Interview", icon: MessageSquare },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
