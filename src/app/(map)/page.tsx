import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Form from "next/form"
import Link from "next/link"
import { getProperties, searchParamsSchema } from "./data"
import { PropertyMap } from "./property-map"

export default async function Page({ searchParams }: { searchParams: Promise<unknown> }) {
  const safeSearchParams = await searchParamsSchema.parseAsync(await searchParams)
  const properties = await getProperties(safeSearchParams)
  return (
    <>
      <PropertyMap properties={properties} />
      <div className="fixed left-4 top-4 bg-primary-foreground px-4 py-2 rounded">
        <h1 className="font-amatic text-3xl text-primary font-bold">PURE PORTUGAL MAP</h1>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed top-4 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 font-bold text-2xl">
            FILTERS
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Form action="" className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
              <DialogDescription>Change which properties are shown</DialogDescription>
            </DialogHeader>
            <Input name="search" placeholder="Search by name or description" defaultValue={safeSearchParams.search} />
            <div className="flex gap-2">
              <Input name="minPrice" placeholder="Min Price" defaultValue={safeSearchParams.minPrice} />
              <Input name="maxPrice" placeholder="Max Price" defaultValue={safeSearchParams.maxPrice} />
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="ghost" asChild>
                  <Link href="/">Clear</Link>
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Search</Button>
              </DialogClose>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
