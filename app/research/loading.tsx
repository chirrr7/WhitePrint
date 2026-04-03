export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full pt-12">
      <div className="h-10 w-48 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
      <div className="h-6 w-96 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
      <div className="grid gap-4 mt-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-black/5 dark:bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
