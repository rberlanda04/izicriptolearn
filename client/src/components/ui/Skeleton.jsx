import { cn } from '../../lib/utils.js';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-border-soft/60 dark:bg-panel-2', className)}
      {...props}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-soft bg-white p-5 flex gap-4">
      <Skeleton className="w-28 h-28 shrink-0 rounded-lg hidden sm:block" />
      <div className="flex-1 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
