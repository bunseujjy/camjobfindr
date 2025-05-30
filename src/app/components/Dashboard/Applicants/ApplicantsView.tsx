"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  ChevronDown,
  Mail,
  Calendar,
  FileText,
  Phone,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  UserCheck,
} from "lucide-react";
import { ApplicantType } from "@/features/applicant/types/job_type";
import ResumePreview from "@/features/resume/db/component/ResumePreview";
import { useReactToPrint } from "react-to-print";
import { mapToResumeValues } from "@/lib/utils";
import { ResumeData } from "@/features/resume/schema/resumeSchema";
import { updateApplicationStatus } from "@/features/applicant/db/applicant";
import { toast } from "sonner";

interface ApplicantsViewProps {
  applicants: ApplicantType[];
}

export function ApplicantsView({ applicants }: ApplicantsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string[]>([]);
  const [selectedApplicant, setSelectedApplicant] =
    useState<ApplicantType | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const saveResumeAsPDF = useReactToPrint({ contentRef });
  // Get unique positions for filter
  const positions = Array.from(
    new Set(
      applicants.map((applicant) => applicant.resume.personal_info?.jobTitle)
    )
  );

  // Filter applicants based on search query and filters
  const filteredApplicants = applicants.filter((applicant) => {
    // Search filter
    const matchesSearch =
      applicant.resume?.personal_info.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      applicant.resume?.personal_info.lastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      applicant.resume?.personal_info.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      applicant?.resume?.personal_info.jobTitle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || applicant.status === statusFilter;

    // Position filter
    const matchesPosition =
      positionFilter.length === 0 ||
      positionFilter.includes(applicant.resume.personal_info?.jobTitle ?? "");

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const togglePositionFilter = (position: string) => {
    setPositionFilter((prev) =>
      prev.includes(position)
        ? prev.filter((p) => p !== position)
        : [...prev, position]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Pending</Badge>;
      case "interviewing":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            Interviewing
          </Badge>
        );

      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const updatingStatus = async (
    applicantId: string,
    status: "pending" | "interviewing" | "rejected"
  ) => {
    try {
      const response = await updateApplicationStatus(applicantId, status);

      if (!response) {
        throw new Error("Failed to update status");
      } else {
        toast.success(`Successfully updating applicant status as ${status}`);
      }
    } catch (error) {
      console.error(error, "Bad Request");
    }
  };
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1 order-2 lg:order-1">
        <CardHeader className="pb-3">
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            {filteredApplicants.length} applicants found
          </CardDescription>

          <div className="mt-4">
            <Tabs defaultValue="all" onValueChange={setStatusFilter}>
              <div className="overflow-x-auto scrollbar-thin pb-2">
                <TabsList className="inline-flex w-auto min-w-full h-10">
                  <TabsTrigger
                    value="all"
                    className="flex-1 px-3 py-1.5 text-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="flex-1 px-3 py-1.5 text-sm"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="interviewing"
                    className="flex-1 px-3 py-1.5 text-sm"
                  >
                    Interviewing
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applicants..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Position</span>
                    {positionFilter.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full px-1"
                      >
                        {positionFilter.length}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Position</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {positions.map((position) => (
                  <DropdownMenuCheckboxItem
                    key={position}
                    checked={positionFilter.includes(position ?? "")}
                    onCheckedChange={() => togglePositionFilter(position ?? "")}
                  >
                    {position}
                  </DropdownMenuCheckboxItem>
                ))}
                {positionFilter.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setPositionFilter([])}
                      className="justify-center text-center"
                    >
                      Clear Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
          <div className="space-y-2">
            {filteredApplicants.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-center text-muted-foreground">
                No applicants found. Try adjusting your search or filters.
              </div>
            ) : (
              filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                    selectedApplicant?.id === applicant.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedApplicant(applicant)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={applicant.resume.personal_info.photo}
                        alt={`${applicant.resume.personal_info.firstName} ${applicant.resume.personal_info.lastName}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          applicant.resume.personal_info.firstName ?? ""
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {applicant.resume.personal_info.firstName}{" "}
                        {applicant.resume.personal_info.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {applicant.resume.personal_info.jobTitle}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(applicant?.status ?? "")}
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(applicant.appliedAt?.toString() ?? "")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 order-1 lg:order-2">
        {selectedApplicant ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedApplicant.resume.personal_info.photo}
                      alt={`${selectedApplicant.resume.personal_info.firstName} ${selectedApplicant.resume.personal_info.lastName}`}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(
                        selectedApplicant.resume.personal_info.firstName ?? ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {selectedApplicant.resume.personal_info.firstName}{" "}
                      {selectedApplicant.resume.personal_info.lastName}
                    </CardTitle>
                    <CardDescription>
                      {selectedApplicant.resume.personal_info.jobTitle}
                    </CardDescription>
                    <div className="mt-2 flex items-center gap-2">
                      {getStatusBadge(selectedApplicant?.status ?? "")}
                      <span className="text-sm text-muted-foreground">
                        Applied on{" "}
                        {formatDate(
                          selectedApplicant.appliedAt?.toString() ?? ""
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Change Status
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center"
                        onClick={() =>
                          updatingStatus(selectedApplicant.id, "pending")
                        }
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                        Mark as Pending
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="flex items-center"
                        onClick={() =>
                          updatingStatus(selectedApplicant.id, "interviewing")
                        }
                      >
                        <Calendar className="mr-2 h-4 w-4 text-amber-500" />
                        Move to Interview
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="flex items-center text-destructive"
                        onClick={() =>
                          updatingStatus(selectedApplicant.id, "rejected")
                        }
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button className="w-full sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="profile"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="overflow-x-auto pb-2">
                  <TabsList className="inline-flex w-auto min-w-full h-10">
                    <TabsTrigger
                      value="profile"
                      className="flex-1 px-3 py-1.5 text-sm"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger
                      value="resume"
                      className="flex-1 px-3 py-1.5 text-sm"
                    >
                      Resume
                    </TabsTrigger>

                    <TabsTrigger
                      value="activity"
                      className="flex-1 px-3 py-1.5 text-sm"
                    >
                      Activity
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="profile" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 text-sm font-medium">
                            Contact Information
                          </h3>
                          <div className="space-y-2 rounded-lg border p-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={`mailto:${selectedApplicant.resume.personal_info.email}`}
                                className="text-sm hover:underline break-all"
                              >
                                {selectedApplicant.resume.personal_info.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={`tel:${selectedApplicant.resume.personal_info.phone}`}
                                className="text-sm hover:underline"
                              >
                                {selectedApplicant.resume.personal_info.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-2 text-sm font-medium">
                            Education
                          </h3>
                          <div className="rounded-lg border p-3">
                            {selectedApplicant.resume.education &&
                              selectedApplicant.resume.education[0].degree}
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-2 text-sm font-medium">
                            Experience
                          </h3>
                          <div className="rounded-lg border p-3">
                            <p className="text-sm">
                              {selectedApplicant.resume.work_experiences &&
                                selectedApplicant.resume.work_experiences[0]
                                  .position}{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 text-sm font-medium">Skills</h3>
                          <div className="flex flex-wrap gap-1.5 rounded-lg border p-3">
                            {selectedApplicant.resume.skills?.map(
                              (skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="mb-2 text-sm font-medium">
                            Documents
                          </h3>
                          <div className="space-y-2 rounded-lg border p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Resume</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 z-10"
                                onClick={() => saveResumeAsPDF()}
                              >
                                <Download className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:inline">
                                  Download
                                </span>
                              </Button>{" "}
                              <div className="absolute opacity-0">
                                <ResumePreview
                                  formData={mapToResumeValues(
                                    selectedApplicant.resume as ResumeData
                                  )}
                                  className=""
                                  contentRef={contentRef}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resume" className="mt-4">
                  <div className="flex h-[300px] sm:h-[400px] items-center justify-center rounded-lg border">
                    <div className="text-center">
                      <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h3 className="mt-2 text-lg font-medium">
                        Resume Preview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Resume preview would be displayed here.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => saveResumeAsPDF()}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </Button>
                      <div className="absolute opacity-0">
                        <ResumePreview
                          formData={mapToResumeValues(
                            selectedApplicant.resume as ResumeData
                          )}
                          className=""
                          contentRef={contentRef}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium">Application Timeline</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                              <FileText className="h-3 w-3" />
                            </div>
                            <div className="h-full w-0.5 bg-border" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Application Submitted
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(
                                selectedApplicant.appliedAt?.toString() ?? ""
                              )}
                            </p>
                          </div>
                        </div>

                        {selectedApplicant.status === "interviewing" && (
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Calendar className="h-3 w-3" />
                              </div>
                              <div className="h-full w-0.5 bg-border" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Interview Scheduled
                              </p>
                              <p className="text-xs text-muted-foreground">
                                April 10, 2023
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-6">
              <UserCheck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">Select an Applicant</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select an applicant from the list to view their details.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
