"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dateOptions, statusOptions } from "./SavedJobsContent";

interface SavedJobsFilterProps {
  dateFilter: string;
  statusFilter: string;
  setDateFilter: (value: string) => void;
  setStatusFilter: (value: string) => void;
}

export function SavedJobsFilter({
  dateFilter,
  statusFilter,
  setDateFilter,
  setStatusFilter,
}: SavedJobsFilterProps) {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filter</span>
            {(dateFilter !== "newest" || statusFilter !== "all") && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {(dateFilter !== "newest" ? 1 : 0) +
                  (statusFilter !== "all" ? 1 : 0)}
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Date</DropdownMenuLabel>
          {dateOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={dateFilter === option.id}
              onCheckedChange={() => setDateFilter(option.id)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {statusOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={statusFilter === option.id}
              onCheckedChange={() => setStatusFilter(option.id)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(dateFilter !== "newest" || statusFilter !== "all") && (
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          onClick={() => {
            setDateFilter("newest");
            setStatusFilter("all");
          }}
        >
          <Check className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear Filters</span>
        </Button>
      )}
    </div>
  );
}
