export default function StudioSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-200 h-[26rem]">
          <div className="skeleton h-56 w-full rounded-b-none" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-5 w-3/4" /><div className="skeleton h-4 w-1/2" /><div className="skeleton h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}