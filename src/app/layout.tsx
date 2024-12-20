import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

export const metadata = {
  title: "Portugal Locator",
  description: "Find properties for sale in Portugal",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
