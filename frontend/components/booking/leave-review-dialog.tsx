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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"
import { usersApi } from "@/lib/api"
// Booking item type
type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

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

interface LeaveReviewDialogProps {
  booking: Booking
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeaveReviewDialog({ booking, open, onOpenChange }: LeaveReviewDialogProps) {
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
  const { toast } = useToast()
  const [ratings, setRatings] = useState<Record<number, number>>(
    Object.fromEntries(
      booking.items.map((item) => [
        item.id,
        item.selfReviews && item.selfReviews?.length > 0 ? item.selfReviews[0].rating : 0
      ])
    )
  )
  const [comments, setComments] = useState<Record<number, string>>(
    Object.fromEntries(
      booking.items.map((item) => [
        item.id,
        item.selfReviews && item.selfReviews?.length > 0 ? item.selfReviews[0].comment : ""
      ])
    )
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle rating change
  const handleRatingChange = (itemId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [itemId]: rating,
    }))
  }

  // Handle comment change
  const handleCommentChange = (itemId: number, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [itemId]: comment,
    }))
  }

  // Handle submit
  const handleSubmit = async (itemId: number, itemType: string) => {
    setIsSubmitting(true)

    try {
      // Simulate API call

      // Format review data for single item
      let reviewData = {
        rating: ratings[itemId],
        comment: comments[itemId],
        [itemType === "vendor" ? "vendorId" : "plannerId"]: itemId,
      }

      // Log review data (in a real app, this would be sent to an API)

      const response = await usersApi.createReview(reviewData)

      if (response.success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        })
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Share your experience with the services you received for booking no. {booking.bookingId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {booking.items.map((item) => (
            <div key={item.id} className="space-y-4 border-b pb-6 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden">
                  <img src={getRandomImage(item.categoryName.toLowerCase()) || "/placeholder.svg"} alt={item.businessName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{item.businessName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.type === "vendor" ? "Vendor" : "Planner"} • {item.categoryName}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rating</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(item.id, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= ratings[item.id] ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">{ratings[item.id]} out of 5</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Comments</p>
                  <Textarea
                    placeholder={`Share your experience with ${item.businessName}...`}
                    value={comments[item.id]}
                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={() => handleSubmit(item.id, item.type)} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

