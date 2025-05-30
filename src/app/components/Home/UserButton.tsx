"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
// Import useUser() and useClerk()
import { useUser, useClerk } from "@clerk/nextjs";
// Import Next's router
import { useRouter } from "next/navigation";
// Import the Image element
import Image from "next/image";
// Import Link to add more buttons to the menu
import Link from "next/link";
import { BriefcaseBusiness, CircleUser, FileText, LogOut } from "lucide-react";
import { UserType } from "@/features/users/types/type";

interface UserButtonProps {
  user: UserType | null;
}
export const UserButton = ({ user }: UserButtonProps) => {
  // Grab the `isLoaded` and `user` from useUser()
  const { isLoaded, user: clerkuser } = useUser();
  // Grab the signOut and openUserProfile methods
  const { signOut, openUserProfile } = useClerk();
  // Get access to Next's router
  const router = useRouter();

  // Make sure that the useUser() hook has loaded
  if (!isLoaded) return null;
  // Make sure there is valid user data
  if (!clerkuser?.id) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {/* Render a button using the image and email from `user` */}
        <Image
          alt={clerkuser?.username as string}
          src={clerkuser?.imageUrl}
          width={100}
          height={100}
          quality={100}
          className="w-full h-full mr-2 rounded-full border border-gray-200 drop-shadow-sm object-cover"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="mt-4 w-auto rounded-xl border border-gray-200 bg-white px-6 py-4 text-black drop-shadow-2xl">
          <DropdownMenu.Label />
          <DropdownMenu.Group className="flex items-center py-3">
            <Image
              alt={clerkuser?.username as string}
              src={clerkuser?.imageUrl}
              width={100}
              height={100}
              quality={100}
              className="w-10 h-10 mr-2 rounded-full border border-gray-200 drop-shadow-sm object-cover"
            />
            <div>
              <h1>
                {clerkuser?.firstName || clerkuser?.lastName !== null
                  ? `${clerkuser?.firstName} ${clerkuser?.lastName}`
                  : clerkuser?.username}
              </h1>
              <p>{clerkuser.primaryEmailAddress?.emailAddress}</p>
            </div>
          </DropdownMenu.Group>
          <DropdownMenu.Separator className="h-px bg-gray-500" />
          <DropdownMenu.Group className="flex flex-col items-start py-3 space-y-2">
            <DropdownMenu.Item asChild className="hover:outline-none">
              {/* Create a button with an onClick to open the User Profile modal */}
              <button
                onClick={() => openUserProfile()}
                className="w-full flex items-center hover:bg-gray-50 py-3"
              >
                <CircleUser /> <span className="pl-2">Profile</span>
              </button>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="hover:outline-none">
              {/* Create a fictional link to /subscriptions */}
              <Link
                href="/additional"
                passHref
                className="w-full flex items-center hover:bg-gray-50 py-3"
              >
                <FileText /> <span className="pl-2">Additional Profile</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className="hover:outline-none">
              {/* Create a fictional link to /subscriptions */}
              <Link
                href="/saved_jobs"
                passHref
                className="w-full flex items-center hover:bg-gray-50 py-3"
              >
                <BriefcaseBusiness /> <span className="pl-2">Saved Jobs</span>
              </Link>
            </DropdownMenu.Item>
            {user?.user?.role === "jobSeeker" ? (
              <DropdownMenu.Item asChild className="hover:outline-none">
                {/* Create a fictional link to /subscriptions */}
                <Link
                  href="/resume"
                  passHref
                  className="w-full flex items-center hover:bg-gray-50 py-3"
                >
                  <FileText /> <span className="pl-2">My Resume</span>
                </Link>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item asChild className="hover:outline-none">
                {/* Create a fictional link to /subscriptions */}
                <Link
                  href="/dashboard"
                  passHref
                  className="w-full flex items-center hover:bg-gray-50 py-3"
                >
                  <FileText /> <span className="pl-2">My Dashboard</span>
                </Link>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Group>
          <DropdownMenu.Separator className="h-px bg-gray-500" />
          <DropdownMenu.Item asChild className="hover:outline-none">
            {/* Create a Sign Out button -- signOut() takes a call back where the user is redirected */}
            <button
              onClick={() => signOut(() => router.push("/"))}
              className="w-full flex items-center hover:bg-gray-50 py-3"
            >
              <LogOut /> <span className="pl-2">Sign Out</span>{" "}
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
