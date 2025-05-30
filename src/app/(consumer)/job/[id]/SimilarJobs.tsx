import { JobPostingResponse } from "@/features/job/types/jobsType";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatSalary } from "@/helper/formatters";

interface SimilarJobsProps {
  job: JobPostingResponse | undefined;
  similarJobs: JobPostingResponse[];
}

export const SimilarJobs = ({ job, similarJobs }: SimilarJobsProps) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Similar Jobs</h2>
      <div className="space-y-4">
        {similarJobs.length > 0 ? (
          similarJobs.map((similarJob) => (
            <Link
              href={`/jobs/${similarJob?.job_posting?.id}`}
              key={similarJob?.job_posting?.id}
            >
              <div className="group hover:bg-muted p-3 rounded-md transition-colors">
                <div className="flex items-start gap-3">
                  <Image
                    src={similarJob?.company?.logo || "/placeholder.svg"}
                    alt={`${similarJob?.job_posting?.company_name} logo`}
                    width={100}
                    height={100}
                    className="h-10 w-10 rounded object-contain bg-gray-50 p-1"
                  />
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {similarJob?.job_posting?.job_title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {similarJob?.job_posting?.company_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {similarJob?.job_posting?.location}
                      </span>
                      {similarJob?.job_posting?.salary && (
                        <span className="flex items-center">
                          <DollarSignIcon className="h-3 w-3 mr-1" />
                          {formatSalary(similarJob?.job_posting?.salary)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No similar jobs found.
          </p>
        )}
      </div>
      <div className="mt-4 text-center">
        <Link
          href={`/jobs?type=${encodeURIComponent(
            job?.job_posting?.job_type ?? ""
          )}`}
          className="text-primary text-sm hover:underline"
        >
          View all {job?.job_posting?.job_type} jobs
        </Link>
      </div>
    </CardContent>
  </Card>
);
