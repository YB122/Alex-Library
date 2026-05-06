export default function Loading() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#F3E8FF]" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#E0AAFF]" />
        </div>
        <p className="text-sm text-[#6B21A8]">Loading...</p>
      </div>
    </section>
  )
}
