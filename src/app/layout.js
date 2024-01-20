import { Poppins } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
// import Loading from "./Loading"

const poppins = Poppins({ subsets: ["latin"], weight: "400" })

export const metadata = {
  title: "OverVote",
  description: "Create By Demigohu",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        {children}
        {/* <Loading /> */}
      </body>
    </html>
  )
}
