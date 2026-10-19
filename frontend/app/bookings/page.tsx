"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  // Clock,
  MapPin,
  Package,
  // Search,
  // Filter,
  ChevronDown,
  ChevronUp,
  Star,
  MessageCircle,
  FileText,
  XCircle,
  // ArrowUpDown,
  Download,
  PoundSterling,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
import { BookingDetailsDialog } from "@/components/booking/booking-details-dialog"
import { LeaveReviewDialog } from "@/components/booking/leave-review-dialog"
import { ContactVendorDialog } from "@/components/booking/contact-vendor-dialog"
import { bookingApi } from "@/lib/api"

// Booking status types
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

// Booking item type
interface BookingItem {
  id: number
  type: "vendor" | "planner"
  businessName: string
  services: string[]
  location: string
  description: string
  website: string
  rating: string
  basePrice: string
  durationHours: number
  categoryName: string
  startDate: string
  endDate: string
  email: string
  phoneNumber: string
  selfReviews: any[] | null
}

// Booking type
interface Booking {
  bookingId: string
  coupleStartDate: string
  coupleEndDate: string
  coupleLocation: string
  status: BookingStatus
  totalPrice: string
  items: BookingItem[]
  bookingDate: string
  notes?: string
  paymentAmount?: string
  paymentDate?: string
  paymentMethod?: string
  transactionId?: string
  paymentStatus?: string
  cardDetails?: string
}

export default function BookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  // const [searchTerm, setSearchTerm] = useState("")
  // const [sortField, setSortField] = useState<string>("date")
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  // const [statusFilter, setStatusFilter] = useState<string>("all")
  // const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [expandedBookings, setExpandedBookings] = useState<Record<string, boolean>>({})
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<BookingItem | null>(null)
  
  function getRandomImage(category: string): string {
    const imageMap = {
      "photography & videography": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Photography",
        // "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=350&fit=crop",
      ],
      "bridal & groom wear": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Flowers",
        // "https://images.unsplash.com/photo-1561644066-9577e4e77d73?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1525510579388-950055f9c6dd?w=500&h=350&fit=crop",
      ],
      "catering & beverages": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Catering",
        // "https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1551218370-88d5d86bf672?w=500&h=350&fit=crop",
      ],
      "entertainment & music": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Music",
        // "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=350&fit=crop",
      ],
      "venue & accommodation": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Venue",
        // "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&h=350&fit=crop",
      ],
      "decor & design": [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Cake",
        // "https://images.unsplash.com/photo-1535254973040-607b474d7f5f?w=500&h=350&fit=crop",
        "https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?w=500&h=350&fit=crop",
      ],
      default: [
        // "/placeholder.svg?height=300&width=400&text=Wedding+Services",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&h=350&fit=crop",
      ],
    }

    // Get the appropriate image array for the category or use default
    const imageArray = imageMap[category] || imageMap.default

    // Return a random image from the array
    const randomIndex = Math.floor(Math.random() * imageArray.length)
    return imageArray[randomIndex]
  }

  // Fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getBookings()
        if (response.success && response.data?.bookings) {
          const transformedBookings = response.data.bookings.map((booking: any) => {
            // Transform vendors/planners into items array
            const items = [
              ...(booking.vendors || []).map((vendor: any) => ({
                id: vendor.vendorId,
                type: "vendor" as const,
                businessName: vendor.businessName,
                services: vendor.services,
                location: vendor.location,
                description: vendor.description,
                website: vendor.website,
                rating: vendor.rating,
                basePrice: vendor.basePrice,
                durationHours: vendor.durationHours,
                categoryName: vendor.categoryName,
                startDate: vendor.startDate,
                endDate: vendor.endDate,
                email: vendor.email,
                phoneNumber: vendor.phoneNumber,
                selfReviews: vendor.self_reviews
              })),
              ...(booking.planners || []).map((planner: any) => ({
                id: planner.plannerId,
                type: "planner" as const,
                businessName: planner.businessName,
                services: planner.services,
                location: planner.location,
                description: planner.description,
                website: planner.website,
                rating: planner.rating,
                basePrice: planner.basePrice,
                durationHours: planner.durationHours,
                categoryName: planner.categoryName,
                startDate: planner.startDate,
                endDate: planner.endDate,
                email: planner.email,
                phoneNumber: planner.phoneNumber,
                selfReviews: planner.self_reviews
              }))
            ];

            // Return transformed booking object
            return {
              bookingId: booking.bookingId,
              coupleStartDate: booking.coupleStartDate,
              coupleEndDate: booking.coupleEndDate,
              coupleLocation: booking.coupleLocation,
              status: booking.status as BookingStatus,
              totalPrice: booking.totalPrice,
              bookingDate: booking.bookingDate,
              notes: booking.notes,
              paymentAmount: booking.paymentAmount,
              paymentDate: booking.paymentDate,
              paymentMethod: booking.paymentMethod,
              transactionId: booking.transactionId,
              paymentStatus: booking.paymentStatus,
              cardDetails: booking.cardDetails,
              items: items
            };
          });

          setBookings(transformedBookings);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch bookings",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }

    fetchBookings()
  }, [toast])

  // Toggle expanded booking
  const toggleExpandBooking = (bookingId: string) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  // Handle view details
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  // Handle leave review
  const handleLeaveReview = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsReviewDialogOpen(true)
  }

  // Handle contact vendor
  const handleContactVendor = (vendor: BookingItem) => {
    setSelectedVendor(vendor)
    setIsContactDialogOpen(true)
  }

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    // Show confirmation dialog
    
      // In a real app, this would call an API to cancel the booking
      const response = await bookingApi.cancelBooking(bookingId)
      if (response.success) {
        toast({
          title: "Booking Cancelled",
          description: `Booking ${bookingId} has been cancelled.`,
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to cancel booking",
          variant: "destructive",
        })
      }

      // Update booking status in our local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingId === bookingId ? { ...booking, status: "cancelled", paymentStatus: "refunded" } : booking,
        ),
      )
  }

  // Handle download invoice
  // const handleDownloadInvoice = (bookingId: string) => {
  //   toast({
  //     title: "Downloading Invoice",
  //     description: `Invoice for booking ${bookingId} is being downloaded.`,
  //   })
  //   // In a real app, this would trigger a download of the invoice PDF
  // }

  // Handle sort change
  // const handleSortChange = (field: string) => {
  //   if (sortField === field) {
  //     // Toggle direction if same field
  //     setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  //   } else {
  //     // Set new field and default to descending
  //     setSortField(field)
  //     setSortDirection("desc")
  //   }
  // }

  // Filter and sort bookings
  // const filteredAndSortedBookings = useMemo(() => {
  //   // First, filter by tab
  //   let filtered = [...bookings]

  //   if (activeTab === "upcoming") {
  //     filtered = filtered.filter(
  //       (booking) =>
  //         new Date(booking.date) > new Date() && (booking.status === "confirmed" || booking.status === "pending"),
  //     )
  //   } else if (activeTab === "past") {
  //     filtered = filtered.filter(
  //       (booking) =>
  //         new Date(booking.date) < new Date() || booking.status === "completed" || booking.status === "cancelled",
  //     )
  //   }

  //   // Then filter by status if not "all"
  //   if (statusFilter !== "all") {
  //     filtered = filtered.filter((booking) => booking.status === statusFilter)
  //   }

  //   // Filter by date range
  //   if (dateRangeFilter !== "all") {
  //     const now = new Date()
  //     if (dateRangeFilter === "next-30-days") {
  //       const thirtyDaysLater = new Date(now)
  //       thirtyDaysLater.setDate(now.getDate() + 30)
  //       filtered = filtered.filter((booking) => {
  //         const bookingDate = new Date(booking.date)
  //         return bookingDate >= now && bookingDate <= thirtyDaysLater
  //       })
  //     } else if (dateRangeFilter === "next-90-days") {
  //       const ninetyDaysLater = new Date(now)
  //       ninetyDaysLater.setDate(now.getDate() + 90)
  //       filtered = filtered.filter((booking) => {
  //         const bookingDate = new Date(booking.date)
  //         return bookingDate >= now && bookingDate <= ninetyDaysLater
  //       })
  //     } else if (dateRangeFilter === "past-30-days") {
  //       const thirtyDaysAgo = new Date(now)
  //       thirtyDaysAgo.setDate(now.getDate() - 30)
  //       filtered = filtered.filter((booking) => {
  //         const bookingDate = new Date(booking.date)
  //         return bookingDate >= thirtyDaysAgo && bookingDate <= now
  //       })
  //     } else if (dateRangeFilter === "past-90-days") {
  //       const ninetyDaysAgo = new Date(now)
  //       ninetyDaysAgo.setDate(now.getDate() - 90)
  //       filtered = filtered.filter((booking) => {
  //         const bookingDate = new Date(booking.date)
  //         return bookingDate >= ninetyDaysAgo && bookingDate <= now
  //       })
  //     }
  //   }

  //   // Filter by search term
  //   if (searchTerm) {
  //     const term = searchTerm.toLowerCase()
  //     filtered = filtered.filter(
  //       (booking) =>
  //         booking.bookingId.toLowerCase().includes(term) ||
  //         booking.coupleLocation.toLowerCase().includes(term) ||
  //         booking.items.some(
  //           (item) => item.businessName.toLowerCase().includes(term) || item.categoryName.toLowerCase().includes(term),
  //         ),
  //     )
  //   }

  //   // Sort the filtered bookings
  //   return filtered.sort((a, b) => {
  //     let comparison = 0

  //     if (sortField === "date") {
  //       comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
  //     } else if (sortField === "amount") {
  //       comparison = a.totalPrice - b.totalPrice
  //     } else if (sortField === "created") {
  //       comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
  //     }

  //     return sortDirection === "asc" ? comparison : -comparison
  //   })
  // }, [bookings, activeTab, statusFilter, dateRangeFilter, searchTerm, sortField, sortDirection])

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
        new Date(booking.coupleStartDate) > new Date() && (booking.status === "confirmed" || booking.status === "pending"),
    ).length

    const past = bookings.filter(
      (booking) =>
        new Date(booking.coupleEndDate) < new Date() || booking.status === "completed" || booking.status === "cancelled",
    ).length

    return { upcoming, past, all: bookings.length }
  }

  const statusCounts = getStatusCounts()

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
            <h1 className="text-3xl font-bold tracking-tight">Your Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all your wedding service bookings</p>
          </div>
          <Button onClick={() => router.push("/vendors")} className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Create New Booking</span>
          </Button>
        </div>

        {/* Tabs and Filters */}
        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="relative">
                  Total Bookings
                  {statusCounts.all > 0 && (
                    <Badge className="ml-2 bg-primary/10 text-primary">{statusCounts.all}</Badge>
                  )}
                </TabsTrigger>
                {/* <TabsTrigger value="upcoming" className="relative">
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
                </TabsTrigger> */}
              </TabsList>

              {/* <div className="flex items-center gap-2">
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
              </div> */}
            </div>

            {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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
            </div> */}

            <TabsContent value="all" className="mt-0">
              {renderBookingsList(bookings)}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0">
              {renderBookingsList(bookings)}
            </TabsContent>

            <TabsContent value="past" className="mt-0">
              {renderBookingsList(bookings)}
            </TabsContent>
          </Tabs>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <div className="mb-4">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              "You don't have any bookings yet. Start by creating a new booking."
            </p>
            <Button onClick={() => router.push("/vendors")}>Create New Booking</Button>
          </div>
        )}
      </div>

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          onContactVendor={handleContactVendor}
          onCancelBooking={handleCancelBooking}
          onDownloadInvoice={() => window.print()}
          onLeaveReview={handleLeaveReview}
        />
      )}

      {/* Leave Review Dialog */}
      {selectedBooking && (
        <LeaveReviewDialog booking={selectedBooking} open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen} />
      )}

      {/* Contact Vendor Dialog */}
      {selectedVendor && (
        <ContactVendorDialog vendor={selectedVendor} open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
      )}
    </div>
  )

  // Helper function to render bookings list
  function renderBookingsList(bookings: Booking[]) {
    if (bookings.length === 0) {
      return null
    }

    return (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card
            key={booking.bookingId}
            className={cn(
              "overflow-hidden transition-all",
              expandedBookings[booking.bookingId] ? "shadow-md" : "hover:shadow-sm",
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{booking.bookingId}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => window.print()}
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
                    <CardDescription>Created on {new Date(booking.bookingDate).toLocaleDateString()}</CardDescription>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <BookingStatusBadge status={booking.status} />

                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        booking.paymentStatus === "completed" && "bg-green-50 text-green-700 border-green-200",
                        booking.paymentStatus === "partially_paid" && "bg-amber-50 text-amber-700 border-amber-200",
                        !booking.paymentStatus && "bg-red-50 text-red-700 border-red-200",
                        booking.paymentStatus === "refunded" && "bg-blue-50 text-blue-700 border-blue-200",
                      )}
                    >
                      {booking.paymentStatus === "completed" && "Paid"}
                      {booking.paymentStatus === "partially_paid" && "Partially Paid"}
                      { !booking.paymentStatus && "Unpaid"}
                      {booking.paymentStatus === "refunded" && "Refunded"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(booking.coupleStartDate)} - {formatDate(booking.coupleEndDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.coupleLocation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PoundSterling className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">
                  {booking.items.length} {booking.items.length === 1 ? "Service" : "Services"} Booked
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpandBooking(booking.bookingId)}
                  className="h-8 px-2 text-xs"
                >
                  {expandedBookings[booking.bookingId] ? (
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

              {expandedBookings[booking.bookingId] && (
                <div className="space-y-3 mt-4">
                  {booking.items.map((item) => (
                    <div key={item.businessName} className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                      <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                        <img
                          src={getRandomImage(item.categoryName.toLowerCase()) || "/placeholder.svg"}
                          alt={item.businessName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="truncate">
                            <p className="font-medium truncate">{item.businessName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.type === "vendor" ? "Vendor" : "Planner"} • {item.categoryName}
                            </p>
                          </div>
                          <p className="font-medium text-sm">£{item.basePrice.toLocaleString()}</p>
                        </div>
                      </div>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContactVendor(item)
                              }}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Contact {item.type === "vendor" ? "Vendor" : "Planner"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}

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
                onClick={() => handleViewDetails(booking)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Details
              </Button>

              {booking.status === "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() => handleLeaveReview(booking)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Leave Review
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
                        This action cannot be undone. The refund will be processed according to our cancellation policy.
                      </p>
                    </div>
                    <div className="p-3 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleCancelBooking(booking.bookingId)}
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

