"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { JobPostingResponse } from "@/features/job/types/jobsType";
import { removeFromSaved } from "@/features/job/db/job";
import Link from "next/link";

interface JobCardProps {
  job: JobPostingResponse;
  applicant: boolean;
}

export function SavedJobsCard({ job, applicant }: JobCardProps) {
  const [saved, setSaved] = useState(true);

  const handleRemove = async (jobId: string) => {
    try {
      setSaved(true);
      const data = await removeFromSaved(jobId);

      if (data) {
        toast("This job has been removed from your saved list.");
      }
    } catch (error) {
      console.error(error, "Bad Request");
    } finally {
      setSaved(false);
    }
  };

  if (!saved) {
    return null;
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image
                src={job.company?.logo || "/placeholder.svg"}
                alt={`${job.company?.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold line-clamp-1">
                {job.job_posting?.job_title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {job.job_posting?.company_name}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={`/job/${job.job_posting?.id}`}>View Job</Link>
              </DropdownMenuItem>{" "}
              <DropdownMenuItem
                onClick={() => handleRemove(job.job_posting?.id)}
              >
                Remove from saved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {job.job_posting?.location}
            </Badge>
            {!applicant ? (
              <Badge className="bg-green-500 text-xs hover:bg-green-600">
                New
              </Badge>
            ) : (
              <Badge className="bg-green-500 text-xs hover:bg-green-600">
                Applied
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium">${job.job_posting?.salary}</p>
          <p className="text-xs text-muted-foreground">
            Posted {job.job_posting?.createdAt.toString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {job.job_posting?.skillsRequired?.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => handleRemove(job.job_posting.id)}
        >
          {saved ? (
            <>
              <BookmarkCheck className="h-3.5 w-3.5" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
        <Link href={`/job/${job.job_posting?.id}`}>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            View Job
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
