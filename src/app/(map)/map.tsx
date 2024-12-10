"use client"

import "mapbox-gl/dist/mapbox-gl.css"
import * as React from "react"
import { useRouter } from "next/navigation"
import ReactMap, { GeolocateControl, Marker, NavigationControl, type MapRef } from "react-map-gl"
import type { Spot } from "@/lib/db"

interface Props {
  spots: Spot[]
}

export function SpotMap({ spots }: Props) {
  const router = useRouter()
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false)
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null)
  const mapRef = React.useRef<MapRef | null>(null)

  const filteredSpots = React.useMemo(
    () => spots?.filter((d) => (maxPrice ? parseInt(d.price) < maxPrice : true)),
    [spots, maxPrice],
  )

  const spotMarkers = React.useMemo(
    () =>
      filteredSpots.map((spot) => (
        <SpotMarker
          spot={spot}
          key={spot.id}
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            router.push(`/${spot.id}`)
            mapRef.current?.flyTo({
              center: [spot.longitude, spot.latitude],
              duration: 1000,
              padding: 50,
              offset: [100, 0],
            })
          }}
        />
      )),
    [filteredSpots, router],
  )

  return (
    <>
      <ReactMap
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoiamNsYWNrZXR0IiwiYSI6ImNpdG9nZDUwNDAwMTMyb2xiZWp0MjAzbWQifQ.fpvZu03J3o5D8h6IMjcUvw"
        style={{ height: "100%", width: "100%" }}
        initialViewState={{ latitude: 41.2, longitude: -8, zoom: 5 }}
        attributionControl={false}
        mapStyle="mapbox://styles/jclackett/clh82jh0q00b601pp2jfl30sh"
      >
        {spotMarkers}
        <GeolocateControl position="bottom-right" />
        <NavigationControl position="bottom-right" />
      </ReactMap>

      <div className="fixed top-10 left-1/2 -translate-x-1/2">
        <button type="button" onClick={() => setIsFiltersOpen(true)} className="bg-white rounded px-4 py-2">
          Filters
        </button>
      </div>

      {isFiltersOpen && (
        <div className="inset-0 fixed flex items-center justify-center p-10">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsFiltersOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsFiltersOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <div className="z-10 relative rounded bg-white p-8 w-[400px]">
            <button type="button" className="absolute top-4 right-4 hover:opacity-60" onClick={() => setIsFiltersOpen(false)}>
              Close
            </button>
            <div className="space-y-8">
              <p>
                <b>Filters</b>
              </p>
              <label>
                Max Price
                <input
                  type="number"
                  value={maxPrice || ""}
                  onChange={(e) => setMaxPrice(e.target.value ? Number.parseInt(e.target.value) : null)}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface MarkerProps {
  spot: Spot
  onClick: (e: { originalEvent: MouseEvent }) => void
}

function SpotMarker(props: MarkerProps) {
  return (
    <Marker onClick={props.onClick} anchor="center" longitude={props.spot.longitude} latitude={props.spot.latitude}>
      <div className="w-4 h-4 shadow-md hover:scale-125 transition-transform cursor-pointer border border-white bg-purple-500 rounded-full" />
    </Marker>
  )
}
