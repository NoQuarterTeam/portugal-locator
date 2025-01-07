import { inngest } from "../lib/inngest"
import * as cheerio from "cheerio"

async function getTotalPages() {
  const response = await fetch("https://pureportugal.co.uk/properties/")
  const html = await response.text()
  const $ = cheerio.load(html)
  // Find the total pages from the pagination text "Page X of Y"
  const paginationText = $(".pagination span:first-child").text().trim()
  const match = paginationText.match(/Page \d+ of (\d+)/)
  if (match) return Number.parseInt(match[1])
  return 1
}

// This job runs every Sunday at midnight
export const loadPages = inngest.createFunction({ id: "get-total-pages" }, { cron: "0 0 * * 0" }, async ({ step }) => {
  const totalPages = await step.run("get-total-pages", getTotalPages)

  // Fallback to 75 pages if the total pages is greater than 75
  const fallBackTotal = Math.min(totalPages, 75)

  const events = Array.from({ length: fallBackTotal }, (_, i) => i + 1).map((page) => ({
    name: "app/process.page",
    data: { page },
  }))

  await step.sendEvent("process-pages", events)
})
