import { cn } from '../lib/utils'

export function Bone({ className, round }) {
  return <div className={cn(round ? 'skeleton-round' : 'skeleton', className)} />
}

export function SkeletonCard({ className, children }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-100/60 p-5 shadow-sm', className)}>
      {children}
    </div>
  )
}

/* ─── Dashboard Skeleton ─── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <Bone className="h-9 w-56 mb-2" />
        <Bone className="h-5 w-80" />
      </div>

      {/* Alert banner */}
      <Bone className="h-16 w-full rounded-2xl" />

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i}>
            <Bone className="h-3 w-24 mb-4" />
            <Bone className="h-10 w-16 mb-2" />
            <Bone className="h-3 w-28" />
          </SkeletonCard>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-3 gap-5">
        <SkeletonCard>
          <Bone className="h-5 w-40 mb-5" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-2">
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-8" />
              </div>
              <Bone className="h-2 w-full" />
            </div>
          ))}
        </SkeletonCard>
        <SkeletonCard className="col-span-2">
          <Bone className="h-5 w-48 mb-5" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <Bone round className="w-9 h-9" />
              <div className="flex-1">
                <Bone className="h-4 w-32 mb-1.5" />
                <Bone className="h-3 w-48" />
              </div>
              <Bone className="h-6 w-10" />
            </div>
          ))}
        </SkeletonCard>
      </div>

      {/* Activity feed */}
      <SkeletonCard>
        <Bone className="h-5 w-36 mb-5" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 mb-3.5">
            <Bone className="w-8 h-8 rounded-xl" />
            <Bone className="h-3 flex-1" />
            <Bone className="h-3 w-16" />
          </div>
        ))}
      </SkeletonCard>
    </div>
  )
}

/* ─── Prospect List Skeleton ─── */
export function ProspectListSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <Bone className="h-9 w-40" />
        <div className="flex gap-3">
          <Bone className="h-10 w-48 rounded-xl" />
          <Bone className="h-10 w-28 rounded-xl" />
          <Bone className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      <SkeletonCard className="overflow-hidden !p-0">
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-3 bg-slate-50/60 border-b border-slate-100">
          {[100, 60, 80, 70, 50, 40].map((w, i) => (
            <Bone key={i} className="h-3" style={{ width: w }} />
          ))}
        </div>
        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50">
            <Bone round className="w-9 h-9" />
            <div className="flex-1">
              <Bone className="h-4 w-32 mb-1.5" />
              <Bone className="h-3 w-48" />
            </div>
            <Bone className="h-6 w-16 rounded-full" />
            <Bone className="h-6 w-10" />
            <Bone className="h-3 w-20" />
          </div>
        ))}
      </SkeletonCard>
    </div>
  )
}

/* ─── Profile Skeleton ─── */
export function ProfileSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <Bone className="h-4 w-32" />

      {/* Header card */}
      <SkeletonCard className="!p-6">
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3">
            <Bone round className="w-16 h-16" />
            <div className="flex gap-3">
              <Bone round className="w-[90px] h-[90px]" />
              <Bone round className="w-[90px] h-[90px]" />
            </div>
          </div>
          <div className="flex-1">
            <Bone className="h-9 w-56 mb-3" />
            <div className="flex gap-2 mb-5">
              <Bone className="h-7 w-16 rounded-full" />
              <Bone className="h-7 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Bone className="h-4 w-48" />
              <Bone className="h-4 w-36" />
              <Bone className="h-4 w-44" />
              <Bone className="h-4 w-40" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100/60">
          <Bone className="h-10 w-36 rounded-xl" />
          <Bone className="h-10 w-36 rounded-xl" />
          <Bone className="h-10 w-32 rounded-xl" />
        </div>
      </SkeletonCard>

      <div className="grid grid-cols-3 gap-5">
        {/* Left column */}
        <div className="col-span-1 space-y-5">
          <SkeletonCard>
            <Bone className="h-4 w-36 mb-3" />
            <Bone className="h-3 w-full mb-2" />
            <Bone className="h-3 w-full mb-2" />
            <Bone className="h-3 w-3/4" />
          </SkeletonCard>
          <SkeletonCard>
            <Bone className="h-4 w-40 mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 mb-2.5">
                <Bone className="w-4 h-4 rounded-md" />
                <Bone className="h-3 flex-1" />
              </div>
            ))}
          </SkeletonCard>
          <SkeletonCard>
            <Bone className="h-4 w-28 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Bone key={i} className="h-3 w-full" />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right column */}
        <div className="col-span-2">
          <SkeletonCard>
            <Bone className="h-5 w-44 mb-4" />
            <Bone className="h-12 w-full rounded-xl mb-5" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <Bone className="w-7 h-7 rounded-lg" />
                <Bone className="h-4 flex-1" />
              </div>
            ))}
          </SkeletonCard>
        </div>
      </div>
    </div>
  )
}

/* ─── Revenue Intelligence Skeleton ─── */
export function RevenueSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <Bone className="h-9 w-64 mb-2" />
        <Bone className="h-5 w-96" />
      </div>

      <Bone className="h-10 w-full rounded-xl" />

      {/* Metric cards */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i}>
            <Bone className="h-3 w-24 mb-4" />
            <Bone className="h-8 w-20 mb-2" />
            <Bone className="h-3 w-28" />
          </SkeletonCard>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-5">
        <SkeletonCard>
          <Bone className="h-5 w-36 mb-5" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-3">
                <Bone className="h-3 w-28" />
                <Bone className="h-9 rounded-xl" style={{ width: `${90 - i * 14}%` }} />
              </div>
            </div>
          ))}
        </SkeletonCard>
        <SkeletonCard>
          <Bone className="h-5 w-48 mb-5" />
          <Bone className="h-[280px] w-full rounded-xl" />
        </SkeletonCard>
      </div>

      {/* Table */}
      <SkeletonCard className="!p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <Bone className="h-5 w-56" />
        </div>
        <div className="px-5 py-3 bg-slate-50/60 border-b border-slate-100 flex gap-6">
          {[...Array(8)].map((_, i) => (
            <Bone key={i} className="h-3 w-16" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-5 py-3.5 border-b border-slate-50 flex gap-6">
            {[...Array(8)].map((_, j) => (
              <Bone key={j} className="h-3 w-16" />
            ))}
          </div>
        ))}
      </SkeletonCard>
    </div>
  )
}
