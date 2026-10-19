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
  // Search,
  // Filter,
  ChevronDown,
  ChevronUp,
  // MessageCircle,
  // ArrowUpDown,
  Download,
  PoundSterling,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
// import { ContactClientDialog } from "@/components/booking/contact-client-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { bookingApi } from "@/lib/api"

// Booking status types
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"
// type PaymentStatus = "completed" | "partially_paid" | "unpaid" | "refunded" | null

// Booking type for vendor view
interface VendorBooking {
  bookingId: number
  coupleId: number
  vendorId: string
  plannerId: string
  status: BookingStatus
  totalPrice: string
  notes: string
  bookingDate: string
  paymentAmount: string
  paymentDate: string
  paymentMethod: string
  transactionId: string
  paymentStatus: string
  cardDetails: string
  businessName: string
  services: string[]
  vendorLocation: string
  vendorDescription: string
  vendorWebsite: string
  vendorRating: string
  vendorBasePrice: string
  vendorDurationHours: number
  categoryName: string
  categoryDescription: string
  startDate: string
  endDate: string
  email: string
  phoneNumber: string
  // Additional fields from couple
  totalCoupleBudget: string
  coupleStartDate: string
  coupleEndDate: string
  coupleLocation: string
  coupleEmail: string
  couplePhoneNumber: string
  coupleFirstName: string
  coupleLastName: string
  coupleGuestCount: number
}


export default function VendorBookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<VendorBooking[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  // const [searchTerm, setSearchTerm] = useState("")
  // const [sortField, setSortField] = useState<string>("date")
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  // const [statusFilter, setStatusFilter] = useState<string>("all")
  // const [dateRangeFilter, setDateRangeFilter] = useState<string>("all")
  const [expandedBookings, setExpandedBookings] = useState<Record<string, boolean>>({})
  // const [selectedBooking, setSelectedBooking] = useState<VendorBooking | null>(null)
  // const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isVendor, setIsVendor] = useState(false)

  // Check if user is a vendor
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // In a real app, this would be an API call to check the user's role
        // await new Promise((resolve) => setTimeout(resolve, 500))

        // For demo purposes, we'll check localStorage
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

        if (userData.roleId != 2) {
          toast({
            title: "Access Denied",
            description: "You must be logged in as a vendor to view this page.",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setIsVendor(true)
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
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await bookingApi.getBookings()
      // console.log("vendors bookingresponse", response)

      if (response.success && response?.data?.bookings?.length) {
        setBookings(response.data.bookings)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load bookings",
          variant: "destructive",
        })
      }

      // setBookings(mockBookings)
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
          booking.bookingId.toString() === bookingId ? { ...booking, status: "cancelled", paymentStatus: "refunded" } : booking,
        ),
      )
  }

  // Toggle expanded booking
  const toggleExpandBooking = (bookingId: string) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  // Handle contact client
  // const handleContactClient = (booking: VendorBooking) => {
  //   setSelectedBooking(booking)
  //   setIsContactDialogOpen(true)
  // }

  // Handle update service status
  const handleUpdateServiceStatus = async(bookingId: string, status: "confirmed" | "completed") => {

    const response = await bookingApi.completeBooking(bookingId)
      if (response.success) {
        toast({
          title: "Booking Completed",
          description: `Booking ${bookingId} has been completed.`,
        })
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to complete booking",
          variant: "destructive",
        })
      }

    // Update booking status in our local state
    setBookings((prev) => prev.map((booking) => (booking.bookingId.toString() === bookingId ? { ...booking, status } : booking)))
  }

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
  //         booking.bookingId.toString().includes(term) ||
  //         booking.location.toLowerCase().includes(term) ||
  //         booking.businessName.toLowerCase().includes(term),
  //     )
  //   }

  //   // Sort the filtered bookings
  //   return filtered.sort((a, b) => {
  //     let comparison = 0

  //     if (sortField === "date") {
  //       comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
  //     } else if (sortField === "amount") {
  //       comparison = a.serviceAmount - b.serviceAmount
  //     } else if (sortField === "created") {
  //       comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  if (!isVendor) {
    return null // Don't render anything until we've verified the user is a vendor
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
            <h1 className="text-3xl font-bold tracking-tight">Your Service Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage all your wedding service appointments</p>
          </div>
          <Button onClick={() => router.push("/profile/vendor")} className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Update Service Offerings</span>
          </Button>
        </div>

        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Reminder</AlertTitle>
          <AlertDescription>
            Please confirm all upcoming bookings at least 7 days before the event date. Update your availability
            calendar regularly to avoid scheduling conflicts.
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
              "You don't have any bookings yet. Update your service offerings to attract more clients."
            </p>
            <Button onClick={() => router.push("/profile/vendor")}>Update Service Offerings</Button>
          </div>
        )}
      </div>

      {/* Contact Client Dialog */}
      {/* {selectedBooking && (
        <ContactClientDialog
          client={selectedBooking.client}
          booking={selectedBooking}
          open={isContactDialogOpen}
          onOpenChange={setIsContactDialogOpen}
        />
      )} */}
    </div>
  )

  // Helper function to render bookings list
  function renderBookingsList(bookings: VendorBooking[]) {
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
              expandedBookings[booking.bookingId.toString()] ? "shadow-md" : "hover:shadow-sm",
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
                      {!booking.paymentStatus && "Unpaid"}
                      {booking.paymentStatus === "refunded" && "Refunded"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatDate(booking.coupleStartDate)} - {formatDate(booking.coupleEndDate)}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.time}</span>
                  </div> */}
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
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{booking.categoryName} Service</h3>
                  <Badge variant="outline" className="text-xs">
                    Wedding ({booking?.coupleGuestCount ?? 100} Guests)
                  </Badge>
                  {/* <Badge variant="outline" className="text-xs">
                    {booking.guestCount} Guests
                  </Badge> */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpandBooking(booking.bookingId.toString())}
                  className="h-8 px-2 text-xs"
                >
                  {expandedBookings[booking.bookingId.toString()] ? (
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

              {expandedBookings[booking.bookingId.toString()] && (
                <div className="space-y-3 mt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Service Details</h4>
                        <p className="text-sm text-muted-foreground">{booking.services?.join(", ")}</p>
                        {booking.vendorDescription && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Description:</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.vendorDescription}
                            </p>
                          </div>
                        )}
                      </div>

                      {booking.vendorDurationHours && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Service Duration</h4>
                          <p className="text-sm text-muted-foreground">{booking.vendorDurationHours} hours</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Client Information</h4>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {`${booking.coupleFirstName?.[0] || ''}${booking.coupleLastName?.[0] || ''}`}
                              </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{booking.coupleFirstName} {booking.coupleLastName}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{booking.coupleEmail}</span>
                              <span>•</span>
                              <span>{booking.couplePhoneNumber}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Payment Information</h4>
                        <div className="flex justify-between text-sm">
                          <span>Payment Method:</span>
                          <span className="font-medium">{booking.paymentMethod} ending in {booking.cardDetails}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Total Booking Value:</span>
                          <span>£{booking.totalPrice.toLocaleString()}</span>
                        </div>
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
              {/* <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleContactClient(booking)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Client
              </Button> */}

              {booking.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={() => handleUpdateServiceStatus(booking.bookingId.toString(), "confirmed")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Service
                </Button>
              )}

              {booking.status === "confirmed" && new Date(booking.coupleStartDate) < new Date() && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                  onClick={() => handleUpdateServiceStatus(booking.bookingId.toString(), "completed")}
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
                      Cancel Service
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-0">
                    <div className="flex flex-col space-y-2 p-4 border-b">
                      <h4 className="font-medium text-sm">Cancel this service?</h4>
                      <p className="text-xs text-muted-foreground">
                        This action cannot be undone. The client will be notified and your service will be marked as
                        cancelled.
                      </p>
                    </div>
                    <div className="p-3 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleCancelBooking(booking.bookingId.toString())}
                      >
                        Cancel Service
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
                        Keep Service
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

