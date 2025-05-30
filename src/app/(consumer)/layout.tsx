import type React from "react";
import Navbar from "../components/Home/Navbar";
import { getCurrentUser } from "@/services/clerk";
import { UserType } from "@/features/users/types/type";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser({ allData: true });
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar user={currentUser as UserType | null} />
      {children}
    </main>
  );
}
