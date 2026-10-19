"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowUpDown,
  Download,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  PlusCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
import { ContactClientDialog } from "@/components/booking/contact-client-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Booking status types
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"
type PaymentStatus = "paid" | "partially_paid" | "unpaid" | "refunded"

// Client type
interface Client {
  id: number
  name: string
  email: string
  phone: string
  image?: string
}

// Vendor type
interface Vendor {
  id: number
  name: string
  category: string
  price: number
  status: "confirmed" | "pending" | "cancelled"
  contactEmail: string
  contactPhone: string
}

// Booking type for planner view
interface PlannerBooking {
  id: string
  date: string
  time: string
  location: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  planningFee: number
  totalAmount: number
  client: Client
  vendors: Vendor[]
  createdAt: string
  eventType: string
  guestCount: number
  timeline?: {
    time: string
    activity: string
  }[]
  budget: {
    total: number
    spent: number
    remaining: number
  }
  notes?: string
}

export default function PlannerBookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<PlannerBooking[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [expandedBookings, setExpandedBookings] = useState<Record<string, boolean>>({})
  const [selectedBooking, setSelectedBooking] = useState<PlannerBooking | null>(null)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isPlanner, setIsPlanner] = useState(false)

  // Check if user is a planner
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // In a real app, this would be an API call to check the user's role
        await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, we'll check localStorage
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

        if (userData.roleId != 3) {
          toast({
            title: "Access Denied",
            description: "You must be logged in as a planner to view this page.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setIsPlanner(true)
        fetchBookings()
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "There was an error verifying your account. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    checkUserRole()
  }, [router, toast])

  // Fetch bookings data
  const fetchBookings = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for planner bookings
      const mockBookings: PlannerBooking[] = [
        {
          id: "BK-123456",
          date: "2024-06-15",
          time: "14:00 - 22:00",
          location: "Sunset Beach Resort, Miami FL",
          status: "confirmed",
          paymentStatus: "paid",
          planningFee: 3500,
          totalAmount: 15800,
          client: {
            id: 1,
            name: "Jessica & Michael Thompson",
            email: "jessica.thompson@example.com",
            phone: "(555) 123-4567",
            image: "/placeholder.svg?height=40&width=40&text=JT",
          },
          vendors: [
            {
              id: 1,
              name: "Elegant Events Photography",
              category: "Photography",
              price: 2500,
              status: "confirmed",
              contactEmail: "info@eleganteventsphoto.com",
              contactPhone: "(555) 234-5678",
            },
            {
              id: 2,
              name: "Divine Floral Designs",
              category: "Florist",
              price: 1800,
              status: "confirmed",
              contactEmail: "flowers@divinefloral.com",
              contactPhone: "(555) 987-6543",
            },
            {
              id: 3,
              name: "Gourmet Wedding Catering",
              category: "Catering",
              price: 8000,
              status: "pending",
              contactEmail: "events@gourmetweddings.com",
              contactPhone: "(555) 678-9012",
            },
          ],
          createdAt: "2023-12-10T14:30:00Z",
          eventType: "Wedding",
          guestCount: 120,
          timeline: [
            { time: "14:00", activity: "Guest arrival" },
            { time: "15:00", activity: "Ceremony begins" },
            { time: "16:00", activity: "Cocktail hour" },
            { time: "17:30", activity: "Reception begins" },
            { time: "19:00", activity: "Dinner service" },
            { time: "20:30", activity: "First dance" },
            { time: "22:00", activity: "End of event" },
          ],
          budget: {
            total: 20000,
            spent: 15800,
            remaining: 4200,
          },
          notes: "Beach wedding with sunset ceremony. Bride has requested extra attention to floral arrangements.",
        },
        {
          id: "BK-789012",
          date: "2024-05-20",
          time: "11:00 - 16:00",
          location: "Garden Pavilion, Los Angeles CA",
          status: "pending",
          paymentStatus: "partially_paid",
          planningFee: 2000,
          totalAmount: 8500,
          client: {
            id: 2,
            name: "Robert & Emma Wilson",
            email: "robert.wilson@example.com",
            phone: "(555) 987-6543",
            image: "/placeholder.svg?height=40&width=40&text=RW",
          },
          vendors: [
            {
              id: 4,
              name: "Harmony Wedding Music",
              category: "Music",
              price: 1200,
              status: "confirmed",
              contactEmail: "bookings@harmonyweddings.com",
              contactPhone: "(555) 345-6789",
            },
            {
              id: 5,
              name: "Sweet Delights Bakery",
              category: "Cake",
              price: 800,
              status: "pending",
              contactEmail: "orders@sweetdelights.com",
              contactPhone: "(555) 456-7890",
            },
          ],
          createdAt: "2023-11-25T10:15:00Z",
          eventType: "Wedding",
          guestCount: 75,
          timeline: [
            { time: "11:00", activity: "Guest arrival" },
            { time: "12:00", activity: "Ceremony begins" },
            { time: "13:00", activity: "Lunch reception" },
            { time: "16:00", activity: "End of event" },
          ],
          budget: {
            total: 10000,
            spent: 8500,
            remaining: 1500,
          },
          notes: "Garden wedding with brunch reception. Still finalizing cake design and music playlist.",
        },
        {
          id: "BK-345678",
          date: "2023-10-08",
          time: "16:00 - 23:00",
          location: "Grand Ballroom, New York NY",
          status: "completed",
          paymentStatus: "paid",
          planningFee: 5000,
          totalAmount: 25000,
          client: {
            id: 3,
            name: "David & Sarah Chen",
            email: "david.chen@example.com",
            phone: "(555) 456-7890",
            image: "/placeholder.svg?height=40&width=40&text=DC",
          },
          vendors: [
            {
              id: 6,
              name: "Luxury Decor & Design",
              category: "Decor",
              price: 5000,
              status: "confirmed",
              contactEmail: "info@luxurydecor.com",
              contactPhone: "(555) 567-8901",
            },
            {
              id: 7,
              name: "Gourmet Wedding Catering",
              category: "Catering",
              price: 12000,
              status: "confirmed",
              contactEmail: "events@gourmetweddings.com",
              contactPhone: "(555) 678-9012",
            },
            {
              id: 8,
              name: "Elegant Events Photography",
              category: "Photography",
              price: 3000,
              status: "confirmed",
              contactEmail: "info@eleganteventsphoto.com",
              contactPhone: "(555) 234-5678",
            },
          ],
          createdAt: "2023-05-12T09:45:00Z",
          eventType: "Wedding",
          guestCount: 200,
          budget: {
            total: 30000,
            spent: 25000,
            remaining: 5000,
          },
          notes: "Luxury ballroom wedding. All vendors performed excellently. Client very satisfied.",
        },
        {
          id: "BK-901234",
          date: "2023-09-15",
          time: "12:00 - 18:00",
          location: "Lakeside Manor, Chicago IL",
          status: "cancelled",
          paymentStatus: "refunded",
          planningFee: 1500,
          totalAmount: 6500,
          client: {
            id: 4,
            name: "Thomas & Olivia Martinez",
            email: "thomas.martinez@example.com",
            phone: "(555) 234-5678",
            image: "/placeholder.svg?height=40&width=40&text=TM",
          },
          vendors: [
            {
              id: 9,
              name: "Elegant Events Photography",
              category: "Photography",
              price: 2500,
              status: "cancelled",
              contactEmail: "info@eleganteventsphoto.com",
              contactPhone: "(555) 234-5678",
            },
            {
              id: 10,
              name: "Divine Floral Designs",
              category: "Florist",
              price: 1500,
              status: "cancelled",
              contactEmail: "flowers@divinefloral.com",
              contactPhone: "(555) 987-6543",
            },
          ],
          createdAt: "2023-04-20T11:30:00Z",
          eventType: "Wedding",
          guestCount: 80,
          budget: {
            total: 8000,
            spent: 0,
            remaining: 8000,
          },
          notes: "Booking cancelled due to venue availability issues. Full refund processed.",
        },
        {
          id: "BK-567890",
          date: "2024-08-22",
          time: "15:00 - 23:00",
          location: "Mountain View Lodge, Denver CO",
          status: "confirmed",
          paymentStatus: "partially_paid",
          planningFee: 4000,
          totalAmount: 18000,
          client: {
            id: 5,
            name: "Christopher & Jennifer Adams",
            email: "christopher.adams@example.com",
            phone: "(555) 876-5432",
            image: "/placeholder.svg?height=40&width=40&text=CA",
          },
          vendors: [
            {
              id: 11,
              name: "Divine Floral Designs",
              category: "Florist",
              price: 2200,
              status: "confirmed",
              contactEmail: "flowers@divinefloral.com",
              contactPhone: "(555) 987-6543",
            },
            {
              id: 12,
              name: "Harmony Wedding Music",
              category: "Music",
              price: 1600,
              status: "confirmed",
              contactEmail: "bookings@harmonyweddings.com",
              contactPhone: "(555) 345-6789",
            },
            {
              id: 13,
              name: "Gourmet Wedding Catering",
              category: "Catering",
              price: 8000,
              status: "pending",
              contactEmail: "events@gourmetweddings.com",
              contactPhone: "(555) 678-9012",
            },
            {
              id: 14,
              name: "Mountain View Lodge",
              category: "Venue",
              price: 5000,
              status: "confirmed",
              contactEmail: "events@mountainviewlodge.com",
              contactPhone: "(555) 789-0123",
            },
          ],
          createdAt: "2024-01-05T13:15:00Z",
          eventType: "Wedding",
          guestCount: 150,
          timeline: [
            { time: "15:00", activity: "Guest arrival" },
            { time: "16:00", activity: "Ceremony begins" },
            { time: "17:00", activity: "Cocktail hour" },
            { time: "18:30", activity: "Reception begins" },
            { time: "19:30", activity: "Dinner service" },
            { time: "21:00", activity: "First dance" },
            { time: "23:00", activity: "End of event" },
          ],
          budget: {
            total: 20000,
            spent: 18000,
            remaining: 2000,
          },
          notes: "Mountain wedding with rustic theme. Still finalizing catering menu and guest list.",
        },
      ]

      setBookings(mockBookings)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Toggle expanded booking
  const toggleExpandBooking = (bookingId: string) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  // Handle contact client
  const handleContactClient = (booking: PlannerBooking) => {
    setSelectedBooking(booking)
    setIsContactDialogOpen(true)
  }

  // Handle update booking status
  const handleUpdateBookingStatus = (bookingId: string, status: "confirmed" | "completed") => {
    // In a real app, this would call an API to update the booking status
    toast({
      title: status === "confirmed" ? "Booking Confirmed" : "Booking Completed",
      description: `Booking ${bookingId} has been marked as ${status}.`,
    })

    // Update booking status in our local state
    setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))
  }

  // Handle download invoice
  const handleDownloadInvoice = (bookingId: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice for booking ${bookingId} is being downloaded.`,
    })
    // In a real app, this would trigger a download of the invoice PDF
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      // Set new field and default to descending
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    // First, filter by tab
    let filtered = [...bookings]

    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.date) > new Date() && (booking.status === "confirmed" || booking.status === "pending"),
      )
    } else if (activeTab === "past") {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.date) < new Date() || booking.status === "completed" || booking.status === "cancelled",
      )
    }

    // Then filter by status if not "all"
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Filter by date range
    if (dateRangeFilter !== "all") {
      const now = new Date()
      if (dateRangeFilter === "next-30-days") {
        const thirtyDaysLater = new Date(now)
        thirtyDaysLater.setDate(now.getDate() + 30)
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= now && bookingDate <= thirtyDaysLater
        })
      } else if (dateRangeFilter === "next-90-days") {
        const ninetyDaysLater = new Date(now)
        ninetyDaysLater.setDate(now.getDate() + 90)
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= now && bookingDate <= ninetyDaysLater
        })
      } else if (dateRangeFilter === "past-30-days") {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(now.getDate() - 30)
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= thirtyDaysAgo && bookingDate <= now
        })
      } else if (dateRangeFilter === "past-90-days") {
        const ninetyDaysAgo = new Date(now)
        ninetyDaysAgo.setDate(now.getDate() - 90)
        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.date)
          return bookingDate >= ninetyDaysAgo && bookingDate <= now
        })
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(term) ||
          booking.location.toLowerCase().includes(term) ||
          booking.client.name.toLowerCase().includes(term) ||
          booking.vendors.some(
            (vendor) => vendor.name.toLowerCase().includes(term) || vendor.category.toLowerCase().includes(term),
          ),
      )
    }

    // Sort the filtered bookings
    return filtered.sort((a, b) => {
      let comparison = 0

      if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === "amount") {
        comparison = a.totalAmount - b.totalAmount
      } else if (sortField === "created") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [bookings, activeTab, statusFilter, dateRangeFilter, searchTerm, sortField, sortDirection])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status counts for badges
  const getStatusCounts = () => {
    const upcoming = bookings.filter(
      (booking) =>
        new Date(booking.date) > new Date() && (booking.status === "confirmed" || booking.status === "pending"),
    ).length

    const past = bookings.filter(
      (booking) =>
        new Date(booking.date) < new Date() || booking.status === "completed" || booking.status === "cancelled",
    ).length

    return { upcoming, past, all: bookings.length }
  }

  const statusCounts = getStatusCounts()

  if (!isPlanner) {
    return null // Don't render anything until we've verified the user is a planner
  }

  if (isLoading) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Wedding Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all your wedding planning clients</p>
          </div>
          <Button onClick={() => router.push("/profile/planner")} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Update Planning Services</span>
          </Button>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Upcoming Events</AlertTitle>
          <AlertDescription>
            You have{" "}
            {
              bookings.filter(
                (b) =>
                  new Date(b.date) > new Date() && new Date(b.date) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              ).length
            }{" "}
            events in the next 14 days. Make sure to confirm all vendor arrangements and finalize timelines.
          </AlertDescription>
        </Alert>

        {/* Tabs and Filters */}
        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="relative">
                  All Bookings
                  {statusCounts.all > 0 && (
                    <Badge className="ml-2 bg-primary/10 text-primary">{statusCounts.all}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="relative">
                  Upcoming
                  {statusCounts.upcoming > 0 && (
                    <Badge className="ml-2 bg-primary/10 text-primary">{statusCounts.upcoming}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past" className="relative">
                  Past
                  {statusCounts.past > 0 && (
                    <Badge className="ml-2 bg-primary/10 text-primary">{statusCounts.past}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      <span>Sort: {sortField.charAt(0).toUpperCase() + sortField.slice(1)}</span>
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-0">
                    <div className="flex flex-col space-y-2 p-4 border-b">
                      <h4 className="font-medium text-sm">Sort Bookings</h4>
                      <p className="text-xs text-muted-foreground">Choose how you want to sort the bookings.</p>
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("date")}
                      className="cursor-pointer focus:bg-muted"
                    >
                      Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("amount")}
                      className="cursor-pointer focus:bg-muted"
                    >
                      Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSortChange("created")}
                      className="cursor-pointer focus:bg-muted"
                    >
                      Created At
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDateRangeFilter("all")
                    setSortField("date")
                    setSortDirection("desc")
                  }}
                  className="h-9 w-9"
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Reset filters</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="next-30-days">Next 30 Days</SelectItem>
                    <SelectItem value="next-90-days">Next 90 Days</SelectItem>
                    <SelectItem value="past-30-days">Past 30 Days</SelectItem>
                    <SelectItem value="past-90-days">Past 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-end">
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedBookings.length} booking{filteredAndSortedBookings.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {renderBookingsList(filteredAndSortedBookings)}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              {renderBookingsList(filteredAndSortedBookings)}
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              {renderBookingsList(filteredAndSortedBookings)}
            </TabsContent>
          </Tabs>
        </div>

        {filteredAndSortedBookings.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <div className="mb-4">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || dateRangeFilter !== "all"
                ? "No bookings match your current filters. Try adjusting your search criteria."
                : "You don't have any bookings yet. Update your planning services to attract more clients."}
            </p>
            <Button onClick={() => router.push("/planner/profile")}>Update Planning Services</Button>
          </div>
        )}
      </div>

      {/* Contact Client Dialog */}
      {selectedBooking && (
        <ContactClientDialog
          client={selectedBooking.client}
          booking={selectedBooking}
          open={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        />
      )}
    </div>
  )

  // Helper function to render bookings list
  function renderBookingsList(bookings: PlannerBooking[]) {
    if (bookings.length === 0) {
      return null
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.id}
            className={cn(
              "overflow-hidden transition-all",
              expandedBookings[booking.id] ? "shadow-md" : "hover:shadow-sm",
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{booking.id}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDownloadInvoice(booking.id)}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>Created on {new Date(booking.createdAt).toLocaleDateString()}</CardDescription>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <BookingStatusBadge status={booking.status} />

                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        booking.paymentStatus === "paid" && "bg-green-50 text-green-700 border-green-200",
                        booking.paymentStatus === "partially_paid" && "bg-amber-50 text-amber-700 border-amber-200",
                        booking.paymentStatus === "unpaid" && "bg-red-50 text-red-700 border-red-200",
                        booking.paymentStatus === "refunded" && "bg-blue-50 text-blue-700 border-blue-200",
                      )}
                    >
                      {booking.paymentStatus === "paid" && "Paid"}
                      {booking.paymentStatus === "partially_paid" && "Partially Paid"}
                      {booking.paymentStatus === "unpaid" && "Unpaid"}
                      {booking.paymentStatus === "refunded" && "Refunded"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{booking.eventType}</h3>
                  <Badge variant="outline" className="text-xs">
                    {booking.guestCount} Guests
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpandBooking(booking.id)}
                  className="h-8 px-2 text-xs"
                >
                  {expandedBookings[booking.id] ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
              </div>

              {expandedBookings[booking.id] && (
                <div className="space-y-4 mt-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Client Information</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                            <img
                              src={booking.client.image || "/placeholder.svg?height=40&width=40"}
                              alt={booking.client.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{booking.client.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{booking.client.email}</span>
                              <span>•</span>
                              <span>{booking.client.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Budget Overview</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Budget:</span>
                            <span className="font-medium">${booking.budget.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Spent:</span>
                            <span
                              className={cn(
                                "font-medium",
                                booking.budget.spent > booking.budget.total && "text-destructive",
                              )}
                            >
                              ${booking.budget.spent.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Remaining:</span>
                            <span className={cn("font-medium", booking.budget.remaining < 0 && "text-destructive")}>
                              ${booking.budget.remaining.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(booking.budget.spent / booking.budget.total) * 100}
                            className={cn("h-2", booking.budget.spent > booking.budget.total && "bg-destructive/20")}
                          />
                        </div>
                      </div>

                      {booking.timeline && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Event Timeline</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {booking.timeline.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium min-w-[60px] text-center">
                                  {item.time}
                                </div>
                                <div className="flex-1">{item.activity}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Vendor Management</h4>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {booking.vendors.map((vendor) => (
                          <div key={vendor.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{vendor.name}</p>
                                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    vendor.status === "confirmed" && "bg-green-50 text-green-700 border-green-200",
                                    vendor.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                                    vendor.status === "cancelled" && "bg-red-50 text-red-700 border-red-200",
                                  )}
                                >
                                  {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-muted-foreground">{vendor.contactEmail}</p>
                                <p className="text-sm font-medium">${vendor.price.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 border-dashed"
                            onClick={() => {
                              toast({
                                title: "Add Vendor",
                                description: "This feature will be available soon.",
                              })
                            }}
                          >
                            <PlusCircle className="h-3.5 w-3.5 mr-1" />
                            Add Vendor
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 rounded-md bg-muted/30 text-sm">
                      <p className="font-medium mb-1">Notes:</p>
                      <p className="text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col sm:flex-row gap-2 pt-2 pb-4 border-t bg-muted/10">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleContactClient(booking)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Client
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  router.push(`/planner/bookings/${booking.id}/timeline`)
                }}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Manage Timeline
              </Button>

              {booking.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={() => handleUpdateBookingStatus(booking.id, "confirmed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
              )}

              {booking.status === "confirmed" && new Date(booking.date) < new Date() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={() => handleUpdateBookingStatus(booking.id, "completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              )}

              {(booking.status === "confirmed" || booking.status === "pending") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-destructive hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-0">
                    <div className="flex flex-col space-y-2 p-4 border-b">
                      <h4 className="font-medium text-sm">Cancel this booking?</h4>
                      <p className="text-xs text-muted-foreground">
                        This action cannot be undone. The client will be notified and all vendors will be informed of
                        the cancellation.
                      </p>
                    </div>
                    <div className="p-3 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          // In a real app, this would call an API to cancel the booking
                          toast({
                            title: "Booking Cancelled",
                            description: `Booking ${booking.id} has been cancelled.`,
                          })

                          // Update booking status in our local state
                          setBookings((prev) =>
                            prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b)),
                          )

                          // Close dropdown
                          const trigger = document.querySelector('[data-state="open"]') as HTMLElement
                          if (trigger) trigger.click()
                        }}
                      >
                        Cancel Booking
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const trigger = document.querySelector('[data-state="open"]') as HTMLElement
                          if (trigger) trigger.click()
                        }}
                      >
                        Keep Booking
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }
}

