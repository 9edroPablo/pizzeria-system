export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="aspect-[4/3] animate-pulse bg-wash" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-wash" />
        <div className="h-5 w-40 animate-pulse rounded-full bg-wash" />
        <div className="h-3 w-full animate-pulse rounded-full bg-wash" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-wash" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-wash" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-wash" />
        </div>
      </div>
    </div>
  )
}
