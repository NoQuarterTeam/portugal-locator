import { getSpots } from "@/lib/db"
import { SpotMap } from "./map"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const spots = await getSpots()

  return (
    <main className="relative h-screen w-screen">
      <SpotMap spots={spots} />
      {children}
    </main>
  )
}
