import "./globals.css"
import { Inter, Amatic_SC } from "next/font/google"
import { ThemeProvider } from "next-themes"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
})
const amatic = Amatic_SC({ subsets: ["latin"], display: "swap", weight: ["400", "700"], variable: "--font-amatic" })

export const metadata = {
  title: "Portugal Locator",
  description: "Find properties for sale in Portugal",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amatic.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
