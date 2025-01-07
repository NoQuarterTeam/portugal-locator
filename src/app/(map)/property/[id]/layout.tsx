import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Link from "next/link"
import type * as React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-4 md:p-8 w-full max-w-[600px] mx-auto">
      <div className="absolute top-2 right-2 md:top-4 md:right-4">
        <Button asChild size="icon" variant="ghost">
          <Link href="/">
            <XIcon size={20} />
          </Link>
        </Button>
      </div>
      {children}
    </div>
  )
}
