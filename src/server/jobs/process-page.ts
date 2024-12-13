import * as cheerio from "cheerio"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { properties } from "../db/schema"
import { inngest } from "../lib/inngest"

export const processPage = inngest.createFunction({ id: "process-page" }, { event: "app/process.page" }, async ({ event }) => {
  const { page } = event.data

  const pageNum = Number.parseInt(page)
  console.log(`Processing page ${pageNum}...`)

  const propertyLinks = await scrapePropertiesPage(pageNum)

  if (propertyLinks.length === 0) return true

  console.log(`Found ${propertyLinks.length} properties on page ${pageNum}`)

  // Process each property
  for (const url of propertyLinks.slice(0, 5)) {
    try {
      const existing = await db.query.properties.findFirst({ where: eq(properties.url, url) })

      const details = await scrapePropertyDetails(url)
      if (existing) {
        console.log("Scraping", url)
        await db
          .update(properties)
          .set({ ...details, url })
          .where(eq(properties.id, existing.id))
      } else {
        console.log("Update", url)
        await db.insert(properties).values({ ...details, url })
      }
    } catch (error) {
      console.error(`Error processing property ${url}:`, error)
    }
  }

  return true
})

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
  const latitude = match ? Number.parseFloat(match[1]) : null
  const longitude = match ? Number.parseFloat(match[2]) : null
  return { latitude: Number.isNaN(latitude) ? null : latitude, longitude: Number.isNaN(longitude) ? null : longitude }
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

  const images: string[] = []

  $(".attachment-full").each((_, element) => {
    const src = $(element).attr("src")
    if (src) {
      images.push(src)
    }
  })

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
    images,
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
