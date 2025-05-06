import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">SkyJourney</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Home
          </Link>
          <Link href="/bookings" className="text-sm font-medium hover:text-blue-600">
            My Bookings
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-blue-600">
            Help
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/bookings">
            <Button variant="outline" size="sm">
              My Bookings
            </Button>
          </Link>
          <Button size="sm">Sign In</Button>
        </div>
      </div>
    </header>
  )
}
