import { getProperty } from "@/app/(map)/property/[id]/data"
import { PropertyDetail } from "@/app/(map)/property/[id]/property-detail"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const property = await getProperty((await params).id)
  return <PropertyDetail property={property} />
}
