import React, { Suspense } from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
