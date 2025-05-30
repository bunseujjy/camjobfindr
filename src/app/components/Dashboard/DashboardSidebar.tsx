"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LayoutDashboard, Briefcase, Users, Menu } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Job Listings",
      href: "/dashboard/jobs",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
    },
    {
      title: "Applicants",
      href: "/dashboard/applicants",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ];

  // Desktop navigation
  const DesktopNav = (
    <nav className="hidden md:grid items-start gap-2 px-2 py-4">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href ? "" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  );

  // Mobile navigation
  const MobileNav = (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden fixed top-[80px] left-4 z-40"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <nav className="grid gap-2 px-2">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "" : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {DesktopNav}
      {MobileNav}
    </>
  );
}
