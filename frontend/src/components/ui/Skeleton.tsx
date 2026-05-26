import { clsx } from 'clsx';

/* ─── Base ───────────────────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-pulse rounded-lg bg-muted', className)} />
  );
}

/* ─── Table / list row (avatar + 2 lines + badges) ──── */
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full shrink-0" />
    </div>
  );
}

/* ─── Project row (title + meta + badge) ────────────── */
export function SkeletonProjectRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className="flex-1 space-y-2 min-w-0">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-4 w-24 hidden md:block" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16 hidden sm:block" />
      </div>
    </div>
  );
}

/* ─── Worker card (grid) ─────────────────────────────── */
export function SkeletonWorkerCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-1.5 mt-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

/* ─── Public worker card (WorkersListPage) ───────────── */
export function SkeletonWorkerPublicCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-3.5 h-3.5 rounded-sm" />
        ))}
        <Skeleton className="h-3 w-12 ml-2" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex justify-between pt-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

/* ─── Project public card ────────────────────────────── */
export function SkeletonProjectCard() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="w-full h-44 rounded-none" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-5 w-16 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}
