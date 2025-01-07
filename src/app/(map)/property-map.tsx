"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import ReactMap, { GeolocateControl, Marker, NavigationControl, type MapRef } from "react-map-gl"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Property } from "@/server/db/schema"
import { useTheme } from "next-themes"
import { useEffect } from "react"

interface Props {
  properties: Property[]
}

export function PropertyMap({ properties }: Props) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const theme = useTheme()
  const router = useRouter()
  const mapRef = React.useRef<MapRef | null>(null)

  const searchParams = useSearchParams()
  const propertyMarkers = React.useMemo(
    () =>
      properties.map((property) => (
        <PropertyMarker
          property={property}
          key={property.id}
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            router.push(`/property/${property.id}?${searchParams.toString() ?? ""}`)
            mapRef.current?.flyTo({
              center: [property.longitude!, property.latitude!],
              duration: 400,
              padding: 50,
              offset: [300, 0],
            })
          }}
        />
      )),
    [properties],
  )

  useEffect(() => {
    ;(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450))
      mapRef.current?.setConfigProperty("basemap", "lightPreset", theme.resolvedTheme === "dark" ? "night" : "light")
    })()
  }, [theme.resolvedTheme])

  return (
    <div className="h-full w-full">
      <ReactMap
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoiamNsYWNrZXR0IiwiYSI6ImNpdG9nZDUwNDAwMTMyb2xiZWp0MjAzbWQifQ.fpvZu03J3o5D8h6IMjcUvw"
        style={{ height: "100%", width: "100%", opacity: isLoaded ? 1 : 0 }}
        initialViewState={{ latitude: 41.2, longitude: -8, zoom: 5 }}
        mapStyle="mapbox://styles/mapbox/standard"
        onLoad={async () => {
          await new Promise((resolve) => setTimeout(resolve, 450))
          setIsLoaded(true)
        }}
      >
        {propertyMarkers}
        <GeolocateControl position="bottom-right" />
        <NavigationControl position="bottom-right" />
      </ReactMap>
      {!isLoaded && (
        <div className="absolute flex items-center justify-center inset-0 z-50">
          <p className="font-amatic text-2xl text-primary-foreground">Loading...</p>
        </div>
      )}
    </div>
  )
}

interface MarkerProps {
  property: Property
  onClick: (e: { originalEvent: MouseEvent }) => void
}

function PropertyMarker(props: MarkerProps) {
  return (
    <Marker onClick={props.onClick} anchor="center" longitude={props.property.longitude!} latitude={props.property.latitude!}>
      <div className="size-5 shadow hover:scale-125 transition-transform cursor-pointer border border-primary-foreground bg-primary-dark rounded-full" />
    </Marker>
  )
}
