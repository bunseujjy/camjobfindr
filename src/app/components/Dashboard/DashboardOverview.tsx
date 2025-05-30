import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, FileText, TrendingUp } from "lucide-react";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { ApplicantType } from "@/features/applicant/types/job_type";

interface DashboardOverviewProps {
  data: JobPostingResponse[];
  applicants: ApplicantType[];
}

export function DashboardOverview({
  data,
  applicants,
}: DashboardOverviewProps) {
  const active = data.map((active) => active.job_posting.available);
  const today = new Date();
  const todayApplicants = applicants.filter((applicant) => {
    if (!applicant.appliedAt) return false;

    const appliedDate = new Date(applicant.appliedAt);
    return (
      appliedDate.getFullYear() === today.getFullYear() &&
      appliedDate.getMonth() === today.getMonth() &&
      appliedDate.getDate() === today.getDate()
    );
  });

  const stats = [
    {
      title: "Total Jobs",
      value: data.length,
      description: `${active.length} active`,
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      trend: "+2 this month",
    },
    {
      title: "Total Applicants",
      value: applicants.length,
      description: `${applicants.length} new`,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: "+18% vs last month",
    },
    {
      title: "Today's Applications",
      value: todayApplicants.length,
      description: "Across all jobs",
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      trend: "+5 since yesterday",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <div className="mt-2 flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              {stat.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
