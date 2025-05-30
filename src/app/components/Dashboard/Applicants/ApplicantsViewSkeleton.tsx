import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ApplicantsViewSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />

          <div className="mt-4">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <div className="flex h-[600px] items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      </Card>
    </div>
  );
}
