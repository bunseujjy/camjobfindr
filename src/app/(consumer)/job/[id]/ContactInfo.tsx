import { JobPostingResponse } from "@/features/job/types/jobsType";
import { Card, CardContent } from "@/components/ui/card";

interface ContactInfoProps {
  job: JobPostingResponse | undefined;
}

export const ContactInfo = ({ job }: ContactInfoProps) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium">Email:</p>
          <a
            href={`mailto:${job?.company?.email}`}
            className="text-primary hover:underline"
          >
            {job?.company?.email}
          </a>
        </div>

        {job?.company?.phone_number && (
          <div>
            <p className="font-medium">Phone:</p>
            <a
              href={`tel:${job?.company?.phone_number}`}
              className="text-primary hover:underline"
            >
              {job?.company?.phone_number}
            </a>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
