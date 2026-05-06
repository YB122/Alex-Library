import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

import { Navbar1 } from "@/components/navbar1"
import { Toaster } from "sonner"
import UserProvider from "@/contexts/UserContext"
import Footer, {
  NEWSLETTER_DATA,
  FOOTER_LINKS,
  CONTACT_LINKS,
} from "@/components/ecommerce-footer1"
import { BackgroundPattern1 } from "@/components/background-pattern1"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <UserProvider>
          <ThemeProvider>
            <div className="fixed inset-0 -z-10">
              <BackgroundPattern1 />
            </div>
            <Navbar1 />
            <main className="container mx-auto min-h-[80vh] px-4 py-8 pt-24">
              {children}
            </main>
            <Footer
              newsletter={NEWSLETTER_DATA}
              footerLinks={FOOTER_LINKS}
              contactLinks={CONTACT_LINKS}
            />
            <Toaster richColors theme="system" />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
