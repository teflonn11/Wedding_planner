"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PoundSterling, Calendar, Clock, AlertTriangle, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PaymentForm } from "@/components/booking/payment-form"
import { BookingSummaryItem } from "@/components/booking/booking-summary-item"
import { bookingApi } from "@/lib/api"

export default function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [bookingItems, setBookingItems] = useState<any[]>([])
  const [totalBudget, setTotalBudget] = useState(0) // Default from couple profile
  const [totalAmount, setTotalAmount] = useState(0)

  const bookingId = searchParams.id

  // Calculate totals
  // const totalAmount = bookingItems.reduce((total, item) => total + item.price, 0)
  const remainingBudget = totalBudget - totalAmount
  const isOverBudget = remainingBudget < 0
  const budgetPercentage = Math.min(Math.round((totalAmount / totalBudget) * 100), 100)

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

  // Load booking data
  useEffect(() => {
    if (!bookingId) {
      toast({
        title: "Error",
        description: "No booking ID provided",
        variant: "destructive",
      })
      // router.push("/bookings")
      return
    }

    const fetchBookingItems = async () => {
      try {
        // Simulate API call
      //   const bookingMockResponse = {
      //     "success": true,
      //     "data": {
      //         "success": true,
      //         "data": {
      //             "totalCoupleBudget": "2000.00",
      //             "bookingId": 2,
      //             "coupleId": 1,
      //             "vendorId": "1",
      //             "plannerId": "",
      //             "status": "pending",
      //             "totalPrice": "100.00",
      //             "notes": "",
      //             "bookingDate": "2025-04-06T18:30:00.000Z",
      //             "paymentAmount": null,
      //             "paymentDate": null,
      //             "paymentMethod": null,
      //             "transactionId": null,
      //             "paymentStatus": null,
      //             "cardDetails": null,
      //             "vendors": [
      //                 {
      //                     "businessName": "Elegant Events Photography",
      //                     "services": [
      //                         "Same-day edit videos"
      //                     ],
      //                     "location": "Miami, FL",
      //                     "description": null,
      //                     "website": "https://www.eleganteventsphoto.com",
      //                     "rating": "0.00",
      //                     "basePrice": "100.00",
      //                     "durationHours": 18,
      //                     "categoryName": "Beauty & Wellness"
      //                 }
      //             ]
      //         }
      //     }
      // }
        const response = await bookingApi.getBookingDetails(bookingId)
        // console.log("booking details response", response);
        if(response.success && response?.data?.data) {
          // console.log("booking details response", response.data.data);
          setBookingDetails(response.data.data)
          setTotalBudget(parseInt(response.data.data.totalCoupleBudget))
          setTotalAmount(parseInt(response.data.data.totalPrice))
          
          let bookingItems = []
          
          // Handle vendors if present
          if (response.data.data?.vendors?.length) {
            const vendorItems = response.data.data.vendors.map((vendor: any) => ({
              id: vendor.vendorId,
              name: vendor.businessName,
              type: "vendor",
              category: vendor.categoryName,
              price: vendor.basePrice,
              image: getRandomImage(vendor.categoryName.toLowerCase()) ?? "/placeholder.svg?height=100&width=100&text=Vendor",
              description: vendor?.description ?? `${vendor.services.join(", ")} for ${vendor.durationHours} hours`,
              location: vendor.location,
            }))
            bookingItems.push(...vendorItems)
          }

          // Handle planners if present
          if (response.data.data?.planners?.length) {
            const plannerItems = response.data.data.planners.map((planner: any) => ({
              id: planner.plannerId,
              name: planner.businessName,
              type: "planner",
              category: planner.categoryName,
              price: planner.basePrice,
              image: getRandomImage(planner.categoryName.toLowerCase()) ?? "/placeholder.svg?height=100&width=100&text=Planner",
              description: planner?.description ?? `${planner.services.join(", ")} for ${planner.durationHours} hours`,
              location: planner.location,
            }))
            bookingItems.push(...plannerItems)
          }

          setBookingItems(bookingItems)
        } else {
          toast({
            title: "Error",
            description: "Failed to load booking data. Please try again.",
            variant: "destructive",
          })
          setLoading(false)
        }
        // Mock data - in a real app this would come from previous selections
        // const mockItems = [
        //   {
        //     id: 1,
        //     name: "Elegant Events Photography",
        //     type: "vendor",
        //     category: "Photography",
        //     price: 2500,
        //     image: "/placeholder.svg?height=100&width=100&text=Photography",
        //     description: "Wedding day photography package, 8 hours coverage",
        //     location: "Los Angeles, CA",
        //   },
        //   {
        //     id: 2,
        //     name: "Divine Floral Designs",
        //     type: "vendor",
        //     category: "Florist",
        //     price: 1800,
        //     image: "/placeholder.svg?height=100&width=100&text=Florist",
        //     description: "Full wedding floral package including bridal bouquet, centerpieces",
        //     location: "Miami, FL",
        //   },
        //   {
        //     id: 3,
        //     name: "Emily Johnson",
        //     type: "planner",
        //     category: "Day-of Coordination",
        //     price: 2500,
        //     image: "/placeholder.svg?height=100&width=100&text=Planner",
        //     description: "Day-of coordination package",
        //     location: "Los Angeles, CA",
        //   },
        // ]

        // setBookingItems(mockItems)
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

    fetchBookingItems()
  }, [toast, bookingId, router])

  // Remove item from booking
  const removeItem = (itemId: number) => {
    // Find the item to be removed to get its price
    const itemToRemove = bookingItems.find(item => item.id === itemId)
    
    setBookingItems((prev) => prev.filter((item) => item.id !== itemId))
    
    // Update total amount by subtracting the removed item's price
    if (itemToRemove) {
      setTotalAmount(prevTotal => prevTotal - parseInt(itemToRemove.price))
    }

    toast({
      title: "Item removed",
      description: "The item has been removed from your booking.",
    })
  }

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    if (bookingItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add vendors or planners to your booking.",
        variant: "destructive",
      })
      return
    }

    setPaymentModalOpen(true)
  }

  // Handle payment submission
  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      setLoading(true)
      // console.log("paymentData", paymentData);
      const lastFourDigits = paymentData.cardNumber.slice(-4); // Returns "3456"
      // Simulate payment processing
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      // Close the modal and redirect to verification page
      setPaymentModalOpen(false)
      router.push(`/booking/verification?id=${bookingId}&totalAmount=${totalAmount}&cardId=${lastFourDigits}`)
    } catch (error) {
      toast({
        title: "Payment error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (loading && bookingItems.length === 0) {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking Summary</h1>
            <p className="text-muted-foreground mt-1">Review your selection before proceeding to payment</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push("/vendors")}>
              Select Vendors
            </Button>
            <Button variant="outline" onClick={() => router.push("/planners")}>
              Select Planners
            </Button>
          </div>
        </div>

        {/* Budget Monitor */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <PoundSterling className="h-5 w-5 mr-1 text-primary" />
              Budget Status
            </h2>
            <div className="grid gap-2 md:grid-cols-3 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="font-semibold">£{totalBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className={`font-semibold ${isOverBudget ? "text-destructive" : ""}`}>
                  £{totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`font-semibold ${isOverBudget ? "text-destructive" : ""}`}>
                  £{remainingBudget.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative pt-1">
              <Progress value={budgetPercentage} className={isOverBudget ? "bg-destructive/20" : ""} />
              {isOverBudget && (
                <div className="flex items-center text-destructive text-sm mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>You're over budget by ${Math.abs(remainingBudget).toLocaleString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {bookingItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">No items in your booking</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't selected any vendors or planners yet. Browse our services to find the perfect match for your
                wedding.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => router.push("/vendors")}>Browse Vendors</Button>
                <Button onClick={() => router.push("/planners")}>Browse Planners</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Booking Items */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold">Selected Items</h2>

              {bookingItems.map((item) => (
                <BookingSummaryItem key={item.id} item={item} onRemove={() => removeItem(item.id)} />
              ))}
            </div>

            {/* Order Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bookingItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.name} ({item.category})
                      </span>
                      <span>£{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <div className="w-full bg-muted/30 rounded-lg p-4 flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Booking Timeline</p>
                    <p className="text-sm text-muted-foreground">
                      Upon confirmation, vendors and planners will contact you within 24-48 hours to discuss your event
                      details.
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={bookingItems.length === 0}
                >
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>

      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Secure Payment
            </DialogTitle>
            <DialogDescription>Your payment information is encrypted and secure.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="font-bold">£{totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This payment secures your booking with the selected vendors and planners.
              </p>
            </div>

            <PaymentForm onSubmit={handlePaymentSubmit} loading={loading} totalAmount={totalAmount} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

