"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, Copy, Printer, Share2, ChevronRight, MapPin, Phone, Mail, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { bookingApi } from "@/lib/api"
import { format } from "date-fns"

export default function BookingDetailsPage({
  searchParams,
}: {
  searchParams: { id?: string; }
}) {
  const router = useRouter()
  const bookingId = searchParams.id
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  // Generate a random booking ID
  const generateBookingId = () => {
    return "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  }

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

  // Load booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await bookingApi.getBookingDetails(bookingId as string)
        // console.log("booking details response", response);
        if(response.success && response?.data?.data) {
          setBookingDetails(response.data.data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load booking data. Please try again.",
            variant: "destructive",
          })
          setLoading(false)
        }
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load booking data. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchBookingDetails()
  }, [toast])

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Copy booking ID to clipboard
  const copyBookingId = () => {
    if (bookingDetails?.bookingId) {
      navigator.clipboard.writeText(bookingDetails.bookingId)
      toast({
        title: "Copied to clipboard",
        description: `Booking ID ${bookingDetails.bookingId} has been copied to your clipboard.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your booking details...</p>
        </div>
      </div>
    )
  }

  if (!Object.keys(bookingDetails).length) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the booking details you're looking for.</p>
          <Button onClick={() => router.push(`/booking/confirmation?id=${bookingId}`)}>Return to Booking</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
            <p className="text-muted-foreground mt-1">Your booking has been confirmed</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
            {/* <Button
              variant="outline"
              size="icon"
              onClick={() =>
                toast({
                  title: "Sharing options",
                  description: "This feature would open sharing options in a real app.",
                })
              }
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button> */}
          </div>
        </div>

        {/* Confirmation Card */}
        <Card className="mb-8 border-green-100 bg-green-50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-700">Booking Confirmed!</h2>
                <p className="text-green-600">Your wedding services have been successfully booked.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Details of your booking</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {bookingDetails.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-base">{bookingDetails.bookingId}</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyBookingId}>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="sr-only">Copy ID</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="font-medium">
                  <Badge
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
                    variant="outline"
                  >
                    {bookingDetails.paymentStatus.toUpperCase()}
                  </Badge>
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{format(new Date(bookingDetails.bookingDate), 'yyyy-MM-dd')}</p>
                </div>
              </div>
              {/* <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Wedding Date</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(bookingDetails.weddingDate)}</p>
                </div>
              </div> */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{bookingDetails.paymentMethod || "Credit Card"} ending in {bookingDetails.cardDetails}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Booked Services</h3>
              <div className="space-y-4">
                {bookingDetails?.vendors?.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <img
                          src={getRandomImage(item.categoryName.toLowerCase()) || "/placeholder.svg"}
                          alt={item.businessName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium">{item.businessName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {"Vendor"} - {item.categoryName}
                            </p>
                          </div>
                          <p className="font-semibold">£{item.basePrice.toLocaleString()}</p>
                        </div>
                        <p className="text-sm mb-2">{item.description}</p>
                        <div className="grid gap-1 mt-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{item.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{item.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {bookingDetails?.planners?.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                        <img
                          src={getRandomImage(item.categoryName.toLowerCase()) || "/placeholder.svg"}
                          alt={item.businessName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium">{item.businessName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {"Planner"} - {item.categoryName}
                            </p>
                          </div>
                          <p className="font-semibold">£{item.basePrice.toLocaleString()}</p>
                        </div>
                        <p className="text-sm mb-2">{item.description}</p>
                        <div className="grid gap-1 mt-2 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{item.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{item.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>£{bookingDetails.totalPrice.toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground w-full">
              <h4 className="font-medium mb-1">What happens next?</h4>
              <p className="mb-2">
                Your service providers will contact you within 24-48 hours to discuss your event details and confirm
                arrangements.
              </p>
              <p>You can manage all your bookings and update your profile from your dashboard.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/bookings")}>
                View All Bookings
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Expect a confirmation call</h3>
                  <p className="text-sm text-muted-foreground">
                    Our wedding coordinator will call you within 24 hours to confirm all details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Schedule consultations</h3>
                  <p className="text-sm text-muted-foreground">
                    Your vendors and planner will reach out to schedule initial consultations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Complete your wedding profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure your wedding profile is complete with all preferences and requirements.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Return to Homepage
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

