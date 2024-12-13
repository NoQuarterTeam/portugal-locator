import { Property } from "@/server/db/schema"

export function PropertyDetail({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-2">
      <a href={property.url} target="_blank" rel="noreferrer" className="underline hover:opacity-70">
        {property.name}
      </a>
      <p>€{property.price?.toLocaleString()}</p>
      <p>{property.subtitle}</p>
      <p>{property.description}</p>
      {/* {property.image && <img src={property.image} alt={property.name} />} */}
    </div>
  )
}
