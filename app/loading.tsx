export default function Loading() {
  return (
    <div className="mobile-only flex flex-col gap-6 p-6 mx-auto w-full pt-12">
      <div className="h-64 w-full bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
      <div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
      <div className="grid gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 w-full bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
