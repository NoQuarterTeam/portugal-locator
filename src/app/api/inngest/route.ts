import { inngest } from "@/server/lib/inngest"
import { serve } from "inngest/next"
import { loadPages } from "@/server/jobs/get-total-pages"
import { processPage } from "@/server/jobs/process-page"

export const maxDuration = 300
export const dynamic = "force-dynamic"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [loadPages, processPage],
})
