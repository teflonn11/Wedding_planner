"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  // Clock,
  Heart,
  Check,
  CalendarCheck,
  // Award,
  // Briefcase,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { plannerApi, usersApi } from "@/lib/api"
import { format } from "date-fns"

export default function PlannerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const plannerId = Number.parseInt(params.id as string, 10)
  const [planner, setPlanner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  // No need for package selection with only one package
  // const [isBookingReady, setIsBookingReady] = useState(true)
  const [reviews, setReviews] = useState<any[]>([])

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

  const faqs = [
    {
      question: "How many weddings do you take on each year?",
      answer:
        "To ensure each couple receives the attention they deserve, I limit my full-service planning to 10-12 weddings per year, and partial planning to 15-18 weddings per year. Month-of coordination services are available on a more flexible basis.",
    },
    {
      question: "Do you work with a team or solo?",
      answer:
        "For most weddings, I bring in a qualified assistant coordinator to ensure comprehensive coverage. For larger weddings (150+ guests), I include a second full coordinator as part of your package at no additional cost.",
    },
    {
      question: "Do you travel for destination weddings?",
      answer:
        "I love planning destination weddings and have experience coordinating events throughout the US, Mexico, Caribbean, and Europe. Travel fees apply and vary depending on the location.",
    },
    {
      question: "How involved will I be in the planning process?",
      answer:
        "As much or as little as you'd like! My planning approach is collaborative, and I'll customize it based on your preferences. Some couples want to be involved in every decision, while others prefer to delegate most tasks—I'm happy to accommodate either approach.",
    },
  ]

  const fetchPlanner = async () => {
    const response = await plannerApi.getPlannerById(plannerId.toString())
    // console.log("fetch planner response", response)
    if(response.success && response.data?.data) {
      setPlanner(response.data.data)
    } else{
      toast({
        title: "Planner not found",
        description: "The requested planner could not be found.",
        variant: "destructive",
      })
      router.push("/planners")
    }
  }

  const fetchReviews = async () => {
    const response = await usersApi.getReviewsByPlannerId(plannerId.toString())
    // console.log("fetch reviews response", response)
    if(response.success && response.data?.reviews) {
      setReviews(response.data.reviews)
    }
  }

  // Fetch planner data
  useEffect(() => {
    if (plannerId) {
      fetchPlanner()
      fetchReviews()
    }
    setLoading(false)
  }, [plannerId, router, toast])

  // const handleBookNow = () => {
  //   setBookingDialogOpen(true)
  // }

  const confirmBooking = () => {
    toast({
      title: "Booking Confirmed!",
      description: `You've booked ${planner.businessName}'s planning services.`,
    })

    setBookingDialogOpen(false)

  }

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!planner) {
    return (
      <div className="container py-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Planner not found</h2>
          <p className="text-muted-foreground mb-6">The requested planner could not be found.</p>
          <Button onClick={() => router.push("/planners")}>Return to Planners</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container pb-16 pt-10">
      <Button
        variant="ghost"
        onClick={() => router.push("/planners")}
        className="mb-6 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to all planners
      </Button>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <div className="rounded-lg overflow-hidden relative">
            <div className="aspect-[3/2] bg-muted relative">
              <img
                src={getRandomImage(planner.categoryName.toLowerCase()) || "/placeholder.svg"}
                alt={planner.businessName}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              <Badge className="mb-2 bg-primary w-fit">
                {planner.categoryName}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold">{planner.businessName}</h1>
              <p className="text-xl opacity-90">{planner.title}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{planner.location}</span>
                </div>
                {planner.rating && <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{planner.rating}</span>
                  {/* <span className="text-sm ml-1">({planner.reviewCount} reviews)</span> */}
                </div>}
                {/* <Badge variant="outline" className="border-white/50 text-xs">
                  {planner.priceRange}
                </Badge> */}
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              {/* <TabsTrigger value="portfolio">Portfolio</TabsTrigger> */}
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About {planner.businessName}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{planner.longDescription}</p>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Experience & Skills
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">{planner.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Certifications</p>
                        <p className="text-sm text-muted-foreground">{planner.certifications.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">Languages</p>
                        <p className="text-sm text-muted-foreground">{planner.languages.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Specialties
                  </h3>
                  <div className="space-y-2">
                    {planner.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}

              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {planner.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Availability & Booking
                </h3>
                <div className="space-y-3">
                  {planner.availability.map((availability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{format(new Date(availability.startDate), "yyyy-MM-dd")} - {format(new Date(availability.endate), "yyyy-MM-dd")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value="portfolio" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <div className="relative overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {planner.portfolio.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="overflow-hidden rounded-lg">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Portfolio item ${index + 1}`}
                              className="aspect-[3/2] object-cover w-full h-full transform transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <p className="text-center text-sm text-muted-foreground italic">
                A selection of weddings planned and designed by {planner.name}. Each event is customized to reflect the
                couple's unique style and vision.
              </p>
            </TabsContent> */}

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(planner.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : star - 0.5 <= planner.rating
                              ? "fill-yellow-400/50 text-yellow-400"
                              : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{planner.rating}</span>
                  {/* <span className="text-muted-foreground">({planner.reviewCount})</span> */}
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.review_id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {/* <AvatarImage src={review.avatar} alt={review.author} /> */}
                            <AvatarFallback>
                              {review.first_name?.[0].toUpperCase()}{review.last_name?.[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.first_name} {review.last_name}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(review.created_at), "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing/Booking Card */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Planning Services</CardTitle>
              <CardDescription>Professional wedding planning by {planner.businessName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <div className="mb-2">
                  <h3 className="font-bold">Full Wedding Planning</h3>
                  <p className="text-2xl font-bold text-primary">£{planner.basePrice.toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive planning from engagement to "I do" for couples seeking a stress-free planning
                  experience.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Unlimited planning consultations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Full vendor selection and management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Complete design and styling</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Budget creation and management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Day-of coordination</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              {/* <Button onClick={handleBookNow} className="w-full">
                Book Now
              </Button> */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Contact Request Sent",
                    description: "We've sent your inquiry to the planner. They'll contact you shortly.",
                  })
                }}
              >
                Contact Planner
              </Button>
            </CardFooter>
          </Card>

          {/* Contact Card */}
          <Card className="relative z-10">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{planner.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{planner.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{planner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{planner.website}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>You're about to book {planner.businessName}. Please review the details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Planning Services</h4>
              <div className="rounded-md bg-muted p-4">
                <div className="flex justify-between mb-1">
                  <span className="font-bold">Full Wedding Planning</span>
                  <span className="font-bold text-primary">£{planner.basePrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comprehensive planning from engagement to "I do" for couples seeking a stress-free planning
                  experience.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <p className="font-medium">Next Steps</p>
              </div>
              <p className="text-sm text-muted-foreground">
                After confirming your booking, the planner will contact you within 24-48 hours to schedule an initial
                consultation to discuss your wedding vision and planning needs.
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="destructive" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

