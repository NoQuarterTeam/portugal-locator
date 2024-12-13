import { getProperty } from "./data"
import { PropertyDetail } from "./property-detail"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const property = await getProperty((await params).id)
  return <PropertyDetail property={property} />
}
