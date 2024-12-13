import "server-only"
import { db } from "@/server/db"
import { properties } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { notFound } from "next/navigation"

export async function getProperty(id: string) {
  "use cache"
  cacheLife("minutes")
  const property = await db.query.properties.findFirst({ where: eq(properties.id, id) })
  if (!property) notFound()
  return property
}
