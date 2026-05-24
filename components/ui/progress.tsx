import * as React from "react"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<"div"> & {
  value?: number
}

function Progress({ value = 0, className, ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div
      data-slot="progress"
      className={cn(
        "h-4 w-full overflow-hidden rounded-full bg-primary/15 shadow-inner",
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}

export { Progress }
