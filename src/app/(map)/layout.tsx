export default async function Layout({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }) {
  return (
    <main className="relative h-screen w-screen">
      {children}
      {sidebar}
    </main>
  )
}
