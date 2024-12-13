import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { nanoid, numericCasted } from "./utils"

export const properties = pgTable("property", {
  id: varchar("id", { length: 10 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 256 }).notNull(),
  price: integer("price"),
  subtitle: varchar("subtitle"),
  description: text("description"),
  landSize: varchar("land_size"),
  latitude: numericCasted("latitude", { precision: 10, scale: 8 }),
  longitude: numericCasted("longitude", { precision: 11, scale: 8 }),
  url: varchar("url", { length: 512 }).notNull().unique(),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Property = typeof properties.$inferSelect
