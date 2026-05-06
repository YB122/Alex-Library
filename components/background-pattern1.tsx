import { cn } from "@/lib/utils"

interface BackgroundPattern1Props {
  className?: string
}

const BackgroundPattern1 = ({ className }: BackgroundPattern1Props) => {
  return (
    <section
      className={cn(
        "relative h-svh max-h-[1200px] min-h-[600px] w-full",
        className
      )}
    >
      {/* Background Pattern */}
      {/* Top Primary Radial Background Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, var(--background) 40%, var(--primary) 100%)",
        }}
      />
    </section>
  )
}

export { BackgroundPattern1 }
