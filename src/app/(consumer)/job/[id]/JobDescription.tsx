import { JobPostingResponse } from "@/features/job/types/jobsType";
import { Badge } from "@/components/ui/badge";

interface JobDescriptionProps {
  job: JobPostingResponse | undefined;
}

export const JobDescription = ({ job }: JobDescriptionProps) => (
  <>
    <div>
      <h2 className="text-xl font-semibold mb-4">Job Description</h2>
      <div
        dangerouslySetInnerHTML={{ __html: job?.job_posting.description ?? "" }}
        className="text-muted-foreground whitespace-pre-line"
      />
    </div>

    <div>
      <h2 className="text-xl font-semibold mb-4">About the Role</h2>
      <div
        dangerouslySetInnerHTML={{ __html: job?.job_posting.about_role ?? "" }}
        className="text-muted-foreground whitespace-pre-line"
      />
    </div>

    {job?.job_posting?.skillsRequired &&
      job?.job_posting?.skillsRequired.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job?.job_posting?.skillsRequired.map((skill, index) => (
              <Badge key={index} className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
  </>
);
