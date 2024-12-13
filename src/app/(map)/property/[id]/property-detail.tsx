import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Property } from "@/server/db/schema"
import { ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function PropertyDetail({ property }: { property: Property }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <a
          href={property.url}
          target="_blank"
          rel="noreferrer"
          className="text-xl w-10/12 flex flex-row gap-2 items-center font-bold underline hover:opacity-70"
        >
          <h1>{property.name}</h1>
        </a>
        <p className="text-sm text-muted-foreground">{property.subtitle}</p>
      </div>
      <div className="flex flex-row gap-1">
        {property.price && <Badge variant="secondary">€{property.price?.toLocaleString()}</Badge>}
        {property.landSize && <Badge variant="secondary">{property.landSize}</Badge>}
      </div>
      {property.images && (
        <div className="flex flex-row rounded gap-1 w-full overflow-scroll">
          {property.images.map((image) => (
            <Image
              unoptimized
              width={200}
              height={200}
              src={image}
              alt={property.name}
              key={image}
              className="w-[200px] h-[200px] shrink-0 object-cover rounded"
            />
          ))}
        </div>
      )}
      <Button variant="outline" asChild>
        <Link href={property.url} target="_blank" rel="noreferrer" className="flex flex-row gap-2 items-center">
          <span>Go to Pure Portugal</span>
          <ExternalLinkIcon />
        </Link>
      </Button>
      <p className="text-sm">{property.description}</p>
      {/* {property.image && <img src={property.image} alt={property.name} />} */}
    </div>
  )
}
