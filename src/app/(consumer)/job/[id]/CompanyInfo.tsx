import { JobPostingResponse } from "@/features/job/types/jobsType";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPinIcon, BuildingIcon, LinkIcon } from "lucide-react";
import Image from "next/image";
import { SocialIcons } from "./SocialIcons";
import { SocialMediaLink } from "./SocialMediaLink";

interface CompanyInfoProps {
  job: JobPostingResponse | undefined;
}

export const CompanyInfo = ({ job }: CompanyInfoProps) => (
  <Card>
    <CardContent className="p-6">
      <h2 className="text-xl font-semibold mb-4">Company Information</h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <Image
            src={job?.company?.logo || "/placeholder.svg?height=60&width=60"}
            alt={`${job?.job_posting.company_name} logo`}
            width={100}
            height={100}
            className="h-12 w-12 rounded-full object-cover mr-3"
          />
          <div>
            <h3 className="font-medium">{job?.job_posting.company_name}</h3>
            <p className="text-sm text-muted-foreground">
              {job?.job_posting.industry}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{job?.company?.location}</span>
          </div>

          <div className="flex items-start">
            <BuildingIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span>{job?.company?.company_size}</span>
          </div>

          {job?.company?.website && (
            <div className="flex items-start">
              <LinkIcon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <a
                href={job?.company?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Company Website
              </a>
            </div>
          )}
        </div>

        {job?.company?.description && (
          <>
            <Separator />
            <div>
              <h3 className="font-medium mb-2">About the Company</h3>
              <div
                dangerouslySetInnerHTML={{ __html: job?.company?.description }}
                className="text-sm text-muted-foreground"
              />
            </div>
          </>
        )}

        <div className="flex gap-3 mt-2">
          <SocialMediaLink
            url={job?.company?.linkedin_url as string}
            label="LinkedIn"
            icon={<SocialIcons.LinkedIn />}
          />
          <SocialMediaLink
            url={job?.company?.twitter_url as string}
            label="Twitter"
            icon={<SocialIcons.Twitter />}
          />
          <SocialMediaLink
            url={job?.company?.facebook_url as string}
            label="Facebook"
            icon={<SocialIcons.Facebook />}
          />
          <SocialMediaLink
            url={job?.company?.instagram_url as string}
            label="Instagram"
            icon={<SocialIcons.Instagram />}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);
