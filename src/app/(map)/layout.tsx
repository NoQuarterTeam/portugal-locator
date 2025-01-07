export default async function Layout({ children, sidebar }: { children: React.ReactNode; sidebar: React.ReactNode }) {
  return (
    <main className="relative h-dvh w-dvw">
      {children}
      {sidebar}
    </main>
  )
}
