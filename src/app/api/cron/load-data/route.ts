import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { saveSpots } from "@/lib/db"

export const runtime = "edge"

interface Spot {
  name: string
  image: string
  latitude: number
  longitude: number
  price: string
  link: string
}

interface NoLocationSpot {
  name: string
  image: string
  price: string
  link: string
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await main()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

async function fetchAndParsePage(pageNumber: number): Promise<{ spots: Spot[]; noLocationSpots: NoLocationSpot[] }> {
  const response = await fetch(`https://your-target-url.com/page/${pageNumber}`)
  const html = await response.text()
  const $ = cheerio.load(html)

  const spots: Spot[] = []
  const noLocationSpots: NoLocationSpot[] = []

  // Example cheerio parsing - adjust selectors based on the actual HTML structure
  $(".property-card").each((_, element) => {
    const name = $(element).find(".property-name").text().trim()
    const image = $(element).find("img").attr("src") || ""
    const price = $(element).find(".price").text().trim()
    const link = $(element).find("a").attr("href") || ""

    // Example: getting coordinates from data attributes
    const latitude = parseFloat($(element).data("latitude"))
    const longitude = parseFloat($(element).data("longitude"))

    if (latitude && longitude) {
      spots.push({ name, image, latitude, longitude, price, link })
    } else {
      noLocationSpots.push({ name, image, price, link })
    }
  })

  return { spots, noLocationSpots }
}

async function main() {
  const totalPages = 10 // Set this to your actual page count

  for (let page = 1; page <= totalPages; page++) {
    const { spots, noLocationSpots } = await fetchAndParsePage(page)
    await saveSpots(spots)
    await saveNoLocationSpots(noLocationSpots)
  }
}
