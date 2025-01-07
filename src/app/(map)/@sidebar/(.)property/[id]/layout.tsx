import type * as React from "react"
import { BackButton } from "./back-button"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed z-50 h-dvh top-0 left-0 bottom-0 p-2 md:p-4">
      <div className="relative flex-1 h-full rounded bg-background p-4 md:p-6 w-full max-w-[500px] overflow-y-scroll shadow-lg">
        <div className="absolute top-2 md:top-4 right-2 md:right-4">
          <BackButton />
        </div>
        {children}
      </div>
    </div>
  )
}
