import { kv } from "@vercel/kv"

export type Spot = {
  id: string
  name: string
  image: string
  latitude: number
  longitude: number
  price: string
  link: string
}
export async function saveSpots(spots: Spot[]) {
  await kv.set("property-spots", spots)
}

export async function getSpots(): Promise<Spot[]> {
  return (await kv.get("property-spots")) || []
}

export async function getSpot(id: string): Promise<Spot | null> {
  const spots = await getSpots()
  return spots.find((spot) => spot.id === id) || null
}
