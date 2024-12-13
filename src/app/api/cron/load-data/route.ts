import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { properties } from "@/server/db/schema"

export const runtime = "edge"

async function fetchHTML(url: string) {
  const response = await fetch(url)
  return await response.text()
}

function extractTextBetweenHeaders(startHeader: string, endHeader: string, $: cheerio.CheerioAPI) {
  const startElement = $(`h2:contains("${startHeader}")`)
  const endElement = $(`h2:contains("${endHeader}")`)

  let description = ""
  let currentElement = startElement.next()

  while (currentElement.length && (!endElement.length || !currentElement.is(endElement))) {
    if (currentElement.is("p")) {
      const text = currentElement.text().trim()
      if (text) {
        description += `${text}\n\n`
      }
    }
    currentElement = currentElement.next()
  }
  return description.trim()
}

function extractCoordinates(scriptContent: string) {
  const match = scriptContent.match(/"point":\s*{\s*"lat":\s*([-\d.]+),\s*"lng":\s*([-\d.]+)\s*}/)
  if (match) return { latitude: Number.parseFloat(match[1]), longitude: Number.parseFloat(match[2]) }
  return null
}
function extractLandSize(text: string) {
  const match = text.match(/Land Size:\s*([\d,]+m2\s*\/\s*[\d.]+ha\s*\/\s*[\d.]+ac)/)
  return match ? match[1] : null
}

async function scrapePropertyDetails(url: string) {
  const html = await fetchHTML(url)
  const $ = cheerio.load(html)

  const scriptContent = $('script:contains("mapp.data.push")').html()
  const coordinates = scriptContent ? extractCoordinates(scriptContent) : null

  return {
    name: $(".reference h2 div").text().trim(),
    price: Number.parseFloat(
      $(".price h2.inline:not(.green)")
        .text()
        .trim()
        .replace(/[^0-9]/g, ""),
    ),
    subtitle: $(".heading h2").text().trim(),
    landSize: extractLandSize(
      $(".single-featured")
        .contents()
        .filter(function () {
          return this.type === "text" && this.data.includes("Land Size:")
        })
        .text()
        .trim(),
    ),
    latitude: coordinates?.latitude,
    longitude: coordinates?.longitude,
    description: extractTextBetweenHeaders("Property Description", "Property Location", $),
    url,
  }
}

async function scrapePropertiesPage(pageNum: number) {
  const baseUrl = "https://pureportugal.co.uk/properties/page"
  const url = `${baseUrl}/${pageNum}/`

  const html = await fetchHTML(url)
  const $ = cheerio.load(html)

  const propertyLinks: string[] = []
  $(".container .card a").each((_, element) => {
    const href = $(element).attr("href")
    if (href) {
      propertyLinks.push(href)
    } else {
      console.log("No href found for", $(element).html())
    }
  })

  return propertyLinks
}

export async function GET(_request: Request) {
  // const authHeader = request.headers.get("Authorization")
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 })

  try {
    let pageNum = 1
    let hasMorePages = true

    while (hasMorePages) {
      console.log(`Scraping page ${pageNum}...`)

      // Get all property links from the current page
      const propertyLinks = await scrapePropertiesPage(pageNum)

      // If no properties found, we've reached the end
      if (propertyLinks.length === 0) {
        hasMorePages = false
        break
      }

      console.log(`Found ${propertyLinks.length} properties on page ${pageNum}`)

      // Process each property
      for (const url of propertyLinks) {
        // Skip if we've already processed this property
        try {
          // Check if property already exists in database
          const existing = await db.query.properties.findFirst({ where: eq(properties.url, url) })

          // Scrape and store new property

          if (existing) {
            console.log("Scraping", url)
            const details = await scrapePropertyDetails(url)
            await db
              .update(properties)
              .set({ ...details, url })
              .where(eq(properties.id, existing.id))
          } else {
            // await db.insert(properties).values({ ...details, url })
          }
        } catch (error) {
          console.error(`Error processing property ${url}:`, error)
        }
      }

      // Move to next page
      pageNum++

      // Add a small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json({ success: false, error: "Failed to scrape properties" }, { status: 500 })
  }
}
