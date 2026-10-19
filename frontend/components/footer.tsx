import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-primary">The Dream Wedding Co.</h3>
            <p className="text-sm text-muted-foreground">Making your special day perfect, one detail at a time.</p>
            {/* <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div> */}
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/rsvp" className="text-muted-foreground hover:text-primary">
                  RSVP
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#full-planning" className="text-muted-foreground hover:text-primary">
                  Full Planning
                </Link>
              </li>
              <li>
                <Link href="/services#partial-planning" className="text-muted-foreground hover:text-primary">
                  Partial Planning
                </Link>
              </li>
              <li>
                <Link href="/services#day-of-coordination" className="text-muted-foreground hover:text-primary">
                  Day-of Coordination
                </Link>
              </li>
              <li>
                <Link href="/services#vendor-management" className="text-muted-foreground hover:text-primary">
                  Vendor Management
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 Wedding Lane</p>
              <p>Celebration City, WD 12345</p>
              <p className="mt-2">info@dreamweddingco.com</p>
              <p>(+44) 555-123-4567</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Dream Wedding Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

