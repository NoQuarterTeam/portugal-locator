import { inngest } from "../lib/inngest"
import * as cheerio from "cheerio"

async function getTotalPages() {
  const response = await fetch("https://pureportugal.co.uk/properties/")
  const html = await response.text()
  const $ = cheerio.load(html)

  // Find the total pages from the pagination text "Page X of Y"
  const paginationText = $(".pagination span").text().trim()
  const match = paginationText.match(/Page \d+ of (\d+)/)

  if (match) return Number.parseInt(match[1])
  return 1 // Default to 1 if we can't find the pagination
}

// This weekly digest function will run at 12:00pm on Friday in the Paris timezone
export const loadPages = inngest.createFunction({ id: "get-total-pages" }, { cron: "0 0 * * 0" }, async ({ step }) => {
  // Load all the users from your database:
  const totalPages = await step.run("get-total-pages", getTotalPages)

  const events = Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => ({ name: "app/process.page", data: { page } }))

  await step.sendEvent("process-pages", events)
})
