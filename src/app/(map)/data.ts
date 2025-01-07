import { db } from "@/server/db"
import { properties } from "@/server/db/schema"
import { and, gte, ilike, isNull, lte, not } from "drizzle-orm"
import { cacheLife } from "next/dist/server/use-cache/cache-life"
import "server-only"
import { z } from "zod"

export const searchParamsSchema = z.object({
  search: z.string().optional().catch(undefined),
  minPrice: z.coerce.number().optional().catch(undefined),
  maxPrice: z.coerce.number().optional().catch(undefined),
})

export async function getProperties(searchParams: z.infer<typeof searchParamsSchema>) {
  "use cache"
  cacheLife("hours")
  return db.query.properties.findMany({
    where: and(
      not(isNull(properties.latitude)),
      not(isNull(properties.longitude)),
      ...(searchParams.search
        ? [
            ilike(properties.name, `%${searchParams.search}%`),
            ilike(properties.subtitle, `%${searchParams.search}%`),
            ilike(properties.description, `%${searchParams.search}%`),
          ]
        : []),
      ...(searchParams.maxPrice ? [lte(properties.price, searchParams.maxPrice)] : []),
      ...(searchParams.minPrice ? [gte(properties.price, searchParams.minPrice)] : []),
    ),
  })
}
