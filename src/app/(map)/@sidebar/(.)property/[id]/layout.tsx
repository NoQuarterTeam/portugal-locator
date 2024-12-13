import type * as React from "react"
import { BackButton } from "./back-button"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed h-screen top-0 left-0 bottom-0 p-4">
      <div className="relative flex-1 h-full rounded bg-background p-6 w-[500px] overflow-y-scroll shadow-lg">
        <div className="absolute top-4 right-4">
          <BackButton />
        </div>
        {children}
      </div>
    </div>
  )
}
