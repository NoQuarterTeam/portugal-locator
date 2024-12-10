import { getSpot } from "@/lib/db"

export default async function Page({ params }: { params: { id: string } }) {
  const spot = await getSpot(params.id)

  if (!spot) return null
  return (
    <div className="fixed top-0 left-0 bottom-0 bg-white p-10 w-[400px]">
      <div className="fixed top-0 left-0 bottom-0 bg-white p-10 w-[400px]">
        <button>Close</button>
        <a target="_blank" href={spot.link} className="underline hover:opacity-70">
          {spot.name}
        </a>
        <p>{spot.price}</p>
        {spot.image && <img src={spot.image} alt={spot.name} />}
      </div>
    </div>
  )
}
