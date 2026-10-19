"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingStatusBadge } from "@/components/booking/booking-status-badge"
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  MessageCircle,
  Download,
  XCircle,
  Star,
  CreditCard,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  PoundSterling,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Booking item type
interface BookingItem {
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
}

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

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

interface BookingDetailsDialogProps {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactVendor: (vendor: BookingItem) => void
  onCancelBooking: (bookingId: string) => void
  onDownloadInvoice: (bookingId: string) => void
  onLeaveReview: (booking: Booking) => void
}

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
  onContactVendor,
  onCancelBooking,
  onDownloadInvoice,
  onLeaveReview,
}: BookingDetailsDialogProps) {

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

  const [activeTab, setActiveTab] = useState("details")

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format date time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const amount = Number(booking.paymentAmount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">Booking {booking.bookingId}</DialogTitle>
              <DialogDescription>Created on {new Date(booking.bookingDate).toLocaleDateString()}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
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
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Event Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="font-medium">{formatDate(booking.coupleStartDate)} - {formatDate(booking.coupleEndDate)}</p>
                </div>
              </div>
              {/* <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Event Time</p>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="font-medium">{booking.time}</p>
                </div>
              </div> */}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Location</p>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="font-medium">{booking.coupleLocation}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <div className="flex items-center gap-1">
                <PoundSterling className="h-4 w-4 text-primary" />
                <p className="font-medium">{booking.totalPrice}</p>
              </div>
            </div>

            {booking.notes && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Notes</p>
                <div className="p-3 rounded-md bg-muted/30">
                  <p>{booking.notes}</p>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <FileText className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(booking.bookingDate)}</p>
                  </div>
                </div>

                {/* {booking.paymentHistory &&
                  booking.paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                        <CreditCard className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.paymentAmount ? "Refund Processed" : "Payment Received"}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(booking.paymentDate)} • ${Math.abs(booking.paymentAmount).toLocaleString()} •{" "}
                          {booking.paymentMethod}
                        </p>
                      </div>
                    </div>
                  ))} */}

                {booking.status === "completed" && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Booking Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.coupleStartDate)} - {formatDate(booking.coupleEndDate)} • All services delivered successfully
                      </p>
                    </div>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 mt-0.5">
                      <XCircle className="h-3 w-3 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium">Booking Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        The booking was cancelled and payment was refunded
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4 pt-4">
            <h3 className="font-medium">Booked Services</h3>
            <div className="space-y-4">
              {booking.items.map((item) => (
                <div key={item.email} className="border rounded-lg overflow-hidden">
                  <div className="flex items-start p-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden mr-4">
                      <img
                        src={getRandomImage(item.categoryName.toLowerCase()) || "/placeholder.svg"}
                        alt={item.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.businessName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.type === "vendor" ? "Vendor" : "Planner"} • {item.categoryName}
                          </p>
                        </div>
                        <p className="font-semibold">£{item.basePrice.toLocaleString()}</p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{item.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{item.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-3 border-t flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => onContactVendor(item)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact {item.type === "vendor" ? "Vendor" : "Planner"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Payment History</h3>
              {/* <Button variant="outline" size="sm" onClick={() => onDownloadInvoice(booking.bookingId)}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button> */}
            </div>

            {booking.paymentAmount && booking.paymentStatus && booking.paymentDate && booking.paymentMethod ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/30 font-medium text-sm">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Method</div>
                </div>

                {/* {booking.paymentHistory.map((payment, index) => ( */}
                  <div key={booking.paymentDate} className="grid grid-cols-3 gap-4 p-3 border-t text-sm">
                    <div>{formatDateTime(booking.paymentDate)}</div>
                    <div className={amount < 0 ? "text-destructive" : "text-green-600"}>
                      {amount < 0 ? "-" : ""}£{Math.abs(amount).toLocaleString()}
                    </div>
                    <div>{booking.paymentMethod}</div>
                  </div>
                {/* // ))} */}

                <div className="grid grid-cols-3 gap-4 p-3 border-t bg-muted/10">
                  <div className="font-medium">Total</div>
                  <div className="font-medium">£{booking.totalPrice.toLocaleString()}</div>
                  <div>
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
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No payment records found</p>
              </div>
            )}

            {booking.paymentStatus === "partially_paid" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Payment Due
                </h4>
                {/* <p className="text-sm mt-1">
                  Remaining balance: $
                  {(
                    booking.totalAmount -
                    (booking.paymentHistory?.reduce((total, payment) => total + payment.amount, 0) || 0)
                  ).toLocaleString()}
                </p> */}
                <Button className="mt-3" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {booking.status === "completed" && (
            <Button variant="outline" onClick={() => onLeaveReview(booking)}>
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
                    onClick={() => onCancelBooking(booking.bookingId)}
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

          {/* <Button variant="outline" onClick={() => onDownloadInvoice(booking.bookingId)}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

