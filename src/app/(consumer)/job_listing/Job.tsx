"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BriefcaseBusiness,
  Calendar,
  Clock,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { UserData } from "@/features/users/types/type";
import Link from "next/link";

type JobListingProps = {
  job: JobPostingResponse;
  all_jobs: JobPostingResponse[];
  user: UserData | null;
};

export default function UserJobsPage({ job, all_jobs, user }: JobListingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("open");
  const user_job = all_jobs.filter(
    (j) => j.job_posting.postedById === user?.id
  );
  const available_job = all_jobs.filter(
    (j) =>
      j.job_posting.postedById === user?.id &&
      j.job_posting.available === "open"
  ).length;

  // Filter jobs based on search query and status filter
  const filteredJobs = all_jobs.filter((job) => {
    const matchesSearch =
      job.job_posting.job_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "open" || job.job_posting.available === filterStatus;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* User Profile Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={user?.imageUrl as string}
                    alt={
                      user?.username ||
                      user?.firstName ||
                      (user?.lastName as string)
                    }
                  />
                  <AvatarFallback>
                    {user?.username
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.company?.location}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{user_job.length}</p>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{available_job}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/new_listing">
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Post New Job
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                Manage Applications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Interviews
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Job Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search jobs..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Available</SelectItem>
                  <SelectItem value="closed">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of{" "}
                {
                  all_jobs.filter((j) => j.job_posting.postedById === user?.id)
                    .length
                }{" "}
                jobs
              </p>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredJobs.map((job) => (
                  <Card key={job.job_posting.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <Badge
                          variant={
                            job.job_posting.available === "open"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {job.job_posting.available === "open"
                            ? "Active"
                            : "Completed"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {job.job_posting.createdAt.toDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl">
                        {job.job_posting.job_title}
                      </CardTitle>
                      <CardDescription>{job.company?.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{job.job_posting.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                          <span>{job.job_posting.job_type}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium">
                            $ {job.job_posting.salary}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Link href={`/job/${job.job_posting.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.job_posting.id}>
                    <div className="flex flex-col sm:flex-row p-4 gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">
                            {job.job_posting.job_title}
                          </h3>
                          <Badge
                            variant={
                              job.job_posting.available === "open"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {job.job_posting.available === "open"
                              ? "Active"
                              : "Completed"}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {job.company?.name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{job.job_posting.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
                            <span>{job.job_posting.job_type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              $ {job.job_posting.salary}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                        <div className="text-sm text-right">
                          <div className="text-muted-foreground">
                            {job.job_posting.createdAt.toDateString()}
                          </div>
                          <div>
                            <span className="font-medium">18</span> applicants
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
