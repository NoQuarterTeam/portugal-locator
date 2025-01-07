"use client"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export function BackButton() {
  const searchParams = useSearchParams()
  return (
    <Button asChild variant="ghost" size="icon">
      <Link href={`/?${searchParams.toString()}`}>
        <XIcon className="size-2 md:size-3" />
      </Link>
    </Button>
  )
}
