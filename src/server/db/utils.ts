import { customType } from "drizzle-orm/pg-core"
import { customAlphabet } from "nanoid"

export const numericCasted = customType<{
  data: number
  driverData: string
  config: { precision?: number; scale?: number }
}>({
  dataType: (config) => {
    if (config?.precision && config?.scale) return `numeric(${config.precision}, ${config.scale})`
    return "numeric"
  },
  fromDriver: (value: string) => Number.parseFloat(value),
  toDriver: (value: number) => value.toString(),
})

export const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10)
