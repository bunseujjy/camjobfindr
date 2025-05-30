"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterState {
  jobType: string[];
  experienceLevel: string[];
  salaryRange: string;
  location: string[];
}

interface JobFiltersProps {
  onApplyFilters: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export function JobFilters({
  onApplyFilters,
  initialFilters,
}: JobFiltersProps) {
  const [jobType, setJobType] = useState<string[]>(
    initialFilters?.jobType || []
  );
  const [experienceLevel, setExperienceLevel] = useState<string[]>(
    initialFilters?.experienceLevel || []
  );
  const [salaryRange, setSalaryRange] = useState(
    initialFilters?.salaryRange || ""
  );
  const [location, setLocation] = useState<string[]>(
    initialFilters?.location || []
  );

  // Update local state when initialFilters change (e.g., from URL)
  useEffect(() => {
    if (initialFilters) {
      setJobType(initialFilters.jobType || []);
      setExperienceLevel(initialFilters.experienceLevel || []);
      setSalaryRange(initialFilters.salaryRange || "");
      setLocation(initialFilters.location || []);
    }
  }, [initialFilters]);

  const handleJobTypeChange = (value: string) => {
    setJobType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleExperienceLevelChange = (value: string) => {
    setExperienceLevel((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleLocationChange = (value: string) => {
    setLocation((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const applyFilters = () => {
    onApplyFilters({
      jobType,
      experienceLevel,
      salaryRange,
      location,
    });
  };

  const clearFilters = () => {
    setJobType([]);
    setExperienceLevel([]);
    setSalaryRange("");
    setLocation([]);

    onApplyFilters({
      jobType: [],
      experienceLevel: [],
      salaryRange: "",
      location: [],
    });
  };

  return (
    <div className="bg-card rounded-lg border p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <Separator />

      <Accordion
        type="multiple"
        defaultValue={["job-type", "experience", "location"]}
      >
        <AccordionItem value="job-type">
          <AccordionTrigger>Industry</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="technology"
                  checked={jobType.includes("Technology")}
                  onCheckedChange={() => handleJobTypeChange("Technology")}
                />
                <Label htmlFor="technology">Technology</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="healthcare"
                  checked={jobType.includes("Healthcare")}
                  onCheckedChange={() => handleJobTypeChange("Healthcare")}
                />
                <Label htmlFor="healthcare">Healthcare</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="finance"
                  checked={jobType.includes("Finance")}
                  onCheckedChange={() => handleJobTypeChange("Finance")}
                />
                <Label htmlFor="finance">Finance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="education"
                  checked={jobType.includes("Education")}
                  onCheckedChange={() => handleJobTypeChange("Education")}
                />
                <Label htmlFor="education">Education</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={jobType.includes("Marketing")}
                  onCheckedChange={() => handleJobTypeChange("Marketing")}
                />
                <Label htmlFor="marketing">Marketing</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger>Experience Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="entry-level"
                  checked={experienceLevel.includes("0-2 years")}
                  onCheckedChange={() =>
                    handleExperienceLevelChange("0-2 years")
                  }
                />
                <Label htmlFor="entry-level">Entry Level (0-2 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mid-level"
                  checked={experienceLevel.includes("3-5 years")}
                  onCheckedChange={() =>
                    handleExperienceLevelChange("3-5 years")
                  }
                />
                <Label htmlFor="mid-level">Mid Level (3-5 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="senior-level"
                  checked={experienceLevel.includes("5+ years")}
                  onCheckedChange={() =>
                    handleExperienceLevelChange("5+ years")
                  }
                />
                <Label htmlFor="senior-level">Senior Level (5+ years)</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary">
          <AccordionTrigger>Salary Range</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={salaryRange} onValueChange={setSalaryRange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-50000" id="r1" />
                <Label htmlFor="r1">$0 - $50,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50000-100000" id="r2" />
                <Label htmlFor="r2">$50,000 - $100,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="100000-150000" id="r3" />
                <Label htmlFor="r3">$100,000 - $150,000</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="150000+" id="r4" />
                <Label htmlFor="r4">$150,000+</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={location.includes("Remote")}
                  onCheckedChange={() => handleLocationChange("Remote")}
                />
                <Label htmlFor="remote">Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on-site"
                  checked={location.includes("On-site")}
                  onCheckedChange={() => handleLocationChange("On-site")}
                />
                <Label htmlFor="on-site">On-site</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-york"
                  checked={location.includes("New York")}
                  onCheckedChange={() => handleLocationChange("New York")}
                />
                <Label htmlFor="new-york">New York</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="san-francisco"
                  checked={location.includes("San Francisco")}
                  onCheckedChange={() => handleLocationChange("San Francisco")}
                />
                <Label htmlFor="san-francisco">San Francisco</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="london"
                  checked={location.includes("London")}
                  onCheckedChange={() => handleLocationChange("London")}
                />
                <Label htmlFor="london">London</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
}
