"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import AuthButtons from "./auth-buttons"
import { ModeToggle } from "./mode-toggle"
import { useTheme } from "next-themes"

// Add custom CSS for nav link underline animation
const navLinkStyles = `
  .nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: hsl(var(--primary));
    transition: width 0.3s ease;
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
`

export default function Header() {
  // Update the mobile menu to be more touch-friendly and improve responsive behavior
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // After mounting, we can access the theme and check screen size
  useEffect(() => {
    setMounted(true)

    // Check if we're on mobile and update state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Update the routes array to include vendor and planner booking links

  const routes = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "RSVP", path: "/rsvp" },
    { name: "Contact", path: "/contact" },
  ]

  // Add state for user-specific routes
  // const [userSpecificRoutes, setUserSpecificRoutes] = useState<{ name: string; path: string }[]>([])

  // Combine standard routes with user-specific routes
  // const allRoutes = [...routes, ...userSpecificRoutes]
  const allRoutes = routes

  // Add conditional routes based on user type
  // useEffect(() => {
  //   if (mounted) {
  //     const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

  //     if (userData.roleId === 2) {
  //       setUserSpecificRoutes([
  //         { name: "My Bookings", path: "/vendor/bookings" },
  //         { name: "Profile", path: "/vendor/profile" },
  //       ])
  //     } else if (userData.roleId === 3) {
  //       setUserSpecificRoutes([
  //         { name: "My Bookings", path: "/planner/bookings" },
  //         { name: "Profile", path: "/planner/profile" },
  //       ])
  //     } else if (userData.roleId === 1) {
  //       setUserSpecificRoutes([
  //         { name: "Vendors", path: "/vendors" },
  //         { name: "Planners", path: "/planners" },
  //         { name: "Bookings", path: "/bookings" },
  //       ])
  //     }
  //   }
  // }, [mounted])

  return (
    <>
      <style>{navLinkStyles}</style>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="8" cy="12" r="5" />
                <circle cx="16" cy="12" r="5" />
                <path d="M12 7v10" />
                <path d="M12 7C9.5 7 8 9 8 12C8 15 9.5 17 12 17C14.5 17 16 15 16 12C16 9 14.5 7 12 7Z" />
              </svg>
              <span className="text-xl font-serif font-bold text-primary">The Dream Wedding Co.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            {allRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative nav-link",
                  pathname === route.path ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.name}
              </Link>
            ))}
            <div className="flex items-center gap-2">
              {mounted && <ModeToggle />}
              <AuthButtons />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && <ModeToggle />}
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="container pb-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              {allRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative nav-link",
                    pathname === route.path ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
              <div className="pt-2">
                <AuthButtons />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

