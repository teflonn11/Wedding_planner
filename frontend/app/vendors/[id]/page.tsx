"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Phone, Mail, Globe, ChevronLeft, Clock, Check, CalendarCheck } from "lucide-react"
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { usersApi, vendorApi } from "@/lib/api"
import { format } from "date-fns"

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const vendorId = Number.parseInt(params.id as string, 10)
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
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
      question: "How many photographers will be at my wedding?",
      answer:
        "It depends on the package you choose. Our Essential package includes one photographer, while our Premium and Luxury packages include two photographers to ensure comprehensive coverage from multiple angles.",
    },
    {
      question: "How long until we receive our photos?",
      answer:
        "You'll receive a sneak peek of 20-30 images within 1-2 weeks after your wedding. The full gallery will be delivered within 6-8 weeks.",
    },
    {
      question: "Can we request specific shots?",
      answer:
        "Before your wedding, we'll send you a questionnaire where you can list any specific shots or moments you want us to capture.",
    },
    {
      question: "Do you offer videography as well?",
      answer:
        "We focus exclusively on photography to ensure we deliver the highest quality images. However, we can recommend trusted videographers we've worked with who complement our style.",
    },
  ]

  const fetchVendor = async () => {
    const response = await vendorApi.getVendorById(vendorId.toString())
    // console.log("fetch vendor response", response)
    if(response.success && response.data?.data) {
      setVendor(response.data.data)
    } else{
      toast({
        title: "Vendor not found",
        description: "The requested vendor could not be found.",
        variant: "destructive",
      })
      router.push("/vendors")
    }
  }

  const fetchReviews = async () => {
    const response = await usersApi.getReviewsByVendorId(vendorId.toString())
    // console.log("fetch reviews response", response)
    if(response.success && response.data?.reviews) {
      setReviews(response.data.reviews)
    }
  }

  useEffect(() => {
    // In a real app, you would fetch from an API
    // For this demo, we'll use the mock data
    if (vendorId) {
      fetchVendor()
      fetchReviews()
    }    
    setLoading(false)
  }, [vendorId, router, toast])

  // Mock vendor data
  const vendorData = [
    {
      id: 1,
      name: "Elegant Events Photography",
      category: "photography",
      description:
        "Capturing timeless moments with a photojournalistic approach. Our team of professional photographers specializes in wedding photography that tells your unique love story through stunning images. With over 10 years of experience, we've documented hundreds of weddings, from intimate ceremonies to grand celebrations.",
      longDescription:
        "At Elegant Events Photography, we believe that your wedding photos should be as unique as your love story. Our team of award-winning photographers brings a perfect blend of technical expertise and artistic vision to capture every magical moment of your special day.\n\nWe take pride in our unobtrusive approach, allowing genuine emotions and moments to unfold naturally while we document them with precision and creativity. From the nervous excitement as you prepare, to the tears of joy during the ceremony, to the celebration on the dance floor – we're there to preserve these memories forever.\n\nOur post-production process ensures that each image is carefully edited to achieve a timeless look that will remain beautiful for generations to come. We offer a variety of packages to suit different needs and budgets, and we're always happy to customize our services to ensure you get exactly what you want.",
      location: "Los Angeles, CA",
      address: "456 Creative Ave, Suite 101, Los Angeles, CA 90028",
      email: "info@eleganteventsphoto.com",
      phone: "(555) 234-5678",
      website: "https://www.eleganteventsphoto.com",
      socialMedia: {
        instagram: "@eleganteventsphoto",
        facebook: "ElegantEventsPhotography",
      },
      rating: 4.9,
      reviewCount: 124,
      reviews: [
        {
          id: 1,
          author: "Jennifer & Michael",
          date: "June 2023",
          rating: 5,
          content:
            "We are absolutely thrilled with our wedding photos! The team captured every special moment and detail perfectly. They were professional, unobtrusive, and made us feel completely at ease. Would recommend them without hesitation!",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 2,
          author: "Sarah & James",
          date: "May 2023",
          rating: 5,
          content:
            "Elegant Events Photography exceeded all our expectations. They have an amazing eye for detail and captured the most beautiful candid moments that we'll treasure forever. Worth every penny!",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: 3,
          author: "Emily & David",
          date: "April 2023",
          rating: 4,
          content:
            "Beautiful photos that captured our day perfectly. The only small issue was that it took a bit longer than expected to receive our final album, but the quality was so good that it was worth the wait.",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      priceRange: "$$$",
      basePrice: 2500,
      packages: [
        {
          id: "basic",
          name: "Essential Coverage",
          price: 2500,
          description: "8 hours of coverage, 1 photographer, 300+ edited images, online gallery",
          included: [
            "8 hours of coverage",
            "1 professional photographer",
            "300+ edited digital images",
            "Online gallery with digital downloads",
            "Print release",
          ],
        },
        {
          id: "standard",
          name: "Premium Coverage",
          price: 3800,
          description:
            "10 hours of coverage, 2 photographers, engagement session, 500+ edited images, online gallery, premium album",
          included: [
            "10 hours of coverage",
            "2 professional photographers",
            "Complimentary engagement session",
            "500+ edited digital images",
            "Online gallery with digital downloads",
            "Premium 10x10 wedding album",
            "Print release",
          ],
        },
        {
          id: "deluxe",
          name: "Luxury Experience",
          price: 5500,
          description:
            "Full day coverage, 2 photographers, engagement & bridal sessions, 700+ edited images, online gallery, luxury albums, wall art",
          included: [
            "Full day coverage (up to 12 hours)",
            "2 professional photographers",
            "Complimentary engagement session",
            "Bridal portrait session",
            "700+ edited digital images",
            "Online gallery with digital downloads",
            "Luxury 12x12 wedding album",
            "Two 8x8 parent albums",
            "16x20 wall art print",
            "Print release",
          ],
        },
      ],
      featured: true,
      portfolio: [
        "/placeholder.svg?height=600&width=900&text=Wedding+Ceremony",
        "/placeholder.svg?height=600&width=900&text=Couple+Portrait",
        "/placeholder.svg?height=600&width=900&text=Wedding+Party",
        "/placeholder.svg?height=600&width=900&text=Reception+Details",
        "/placeholder.svg?height=600&width=900&text=First+Dance",
        "/placeholder.svg?height=600&width=900&text=Candid+Moments",
      ],
      services: [
        "Wedding Photography",
        "Engagement Sessions",
        "Bridal Portraits",
        "Destination Weddings",
        "Photo Albums",
        "Digital Files",
        "Prints & Canvases",
      ],
      availability: ["Weekends", "Weekdays"],
      bookingLeadTime: "6-12 months in advance",
      travelPolicy: "Free travel within 30 miles of Los Angeles. Additional fee for locations beyond.",
      faqs: [
        {
          question: "How many photographers will be at my wedding?",
          answer:
            "It depends on the package you choose. Our Essential package includes one photographer, while our Premium and Luxury packages include two photographers to ensure comprehensive coverage from multiple angles.",
        },
        {
          question: "How long until we receive our photos?",
          answer:
            "You'll receive a sneak peek of 20-30 images within 1-2 weeks after your wedding. The full gallery will be delivered within 6-8 weeks.",
        },
        {
          question: "Can we request specific shots?",
          answer:
            "Before your wedding, we'll send you a questionnaire where you can list any specific shots or moments you want us to capture.",
        },
        {
          question: "Do you offer videography as well?",
          answer:
            "We focus exclusively on photography to ensure we deliver the highest quality images. However, we can recommend trusted videographers we've worked with who complement our style.",
        },
      ],
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
    },
    // More vendor data would be here
  ]

  // Fetch vendor data
  // useEffect(() => {
  //   // In a real app, you would fetch from an API
  //   // For this demo, we'll use the mock data
  //   const vendor = vendorData.find((v) => v.id === vendorId)

  //   if (vendor) {
  //     setVendor(vendor)
  //   } else {
  //     // If vendor not found, redirect to vendors page
  //     router.push("/vendors")
  //     toast({
  //       title: "Vendor not found",
  //       description: "The requested vendor could not be found.",
  //       variant: "destructive",
  //     })
  //   }

  //   setLoading(false)
  // }, [vendorId, router, toast])

  // const handleBookNow = () => {
  //   if (!selectedPackage) {
  //     toast({
  //       title: "Please select a package",
  //       description: "You need to select a package before booking.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   setBookingDialogOpen(true)
  // }

  const confirmBooking = () => {
    const selectedPkg = vendor.packages.find((pkg) => pkg.id === selectedPackage)

    toast({
      title: "Booking Confirmed!",
      description: `You've booked ${vendor.name} - ${selectedPkg.name} package.`,
    })

    setBookingDialogOpen(false)

    // In a real app, you would navigate to a confirmation page
    // router.push('/bookings/confirmation')
  }

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container py-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Vendor not found</h2>
          <p className="text-muted-foreground mb-6">The requested vendor could not be found.</p>
          <Button onClick={() => router.push("/vendors")}>Return to Vendors</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container pb-16 pt-10">
      <Button
        variant="ghost"
        onClick={() => router.push("/vendors")}
        className="mb-6 hover:bg-transparent p-0 flex items-center text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to all vendors
      </Button>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <div className="rounded-lg overflow-hidden relative">
            <div className="aspect-[3/2] bg-muted relative">
              <img src={getRandomImage(vendor.categoryName.toLowerCase()) || "/placeholder.svg"} alt={vendor.businessName} className="object-cover w-full h-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              <Badge className="mb-2 bg-primary w-fit">
                {vendor.categoryName}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold">{vendor.businessName}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{vendor.location}</span>
                </div>
                {vendor.rating && <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{vendor.rating}</span>
                  {/* <span className="text-sm ml-1">({vendor.reviewCount} reviews)</span> */}
                </div>}
                {/* <Badge variant="outline" className="border-white/50 text-xs">
                  {vendor.priceRange}
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
                <h2 className="text-2xl font-bold mb-4">About {vendor.businessName}</h2>
                <p className="text-muted-foreground whitespace-pre-line">{vendor.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Our Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {vendor.services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Availability & Booking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Available</span>
                    </div>
                    <div className="space-y-3">
                  {vendor.availability.map((availability, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{format(new Date(availability.startDate), "yyyy-MM-dd")} - {format(new Date(availability.endate), "yyyy-MM-dd")}</span>
                    </div>
                  ))}
                </div>
                    {/* <p className="text-sm text-muted-foreground ml-6">{vendor.availability.join(", ")}</p> */}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">Booking Lead Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">1-2 weeks in advance</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Travel Policy</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">Free travel within 30 miles of {vendor.location}. Additional fee for locations beyond.</p>
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value="portfolio" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
              <div className="relative overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {vendor.portfolio.map((image, index) => (
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
                A sample of our work from previous weddings. Contact us to see more examples specific to your style and
                venue.
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
                          star <= Math.floor(vendor.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : star - 0.5 <= vendor.rating
                              ? "fill-yellow-400/50 text-yellow-400"
                              : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{vendor.rating}</span>
                  {/* <span className="text-muted-foreground">({vendor.reviewCount})</span> */}
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
              <CardTitle>Packages & Pricing</CardTitle>
              <CardDescription>Choose the package that suits your needs</CardDescription>
            </CardHeader>
            {/* <CardContent className="space-y-6">
              {vendor.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative rounded-lg border p-4 cursor-pointer transition-all hover:border-primary",
                    selectedPackage === pkg.id ? "border-primary bg-primary/5" : "border-muted",
                  )}
                >
                  {selectedPackage === pkg.id && (
                    <div className="absolute top-3 right-3">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div className="mb-2">
                    <h3 className="font-bold">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-primary">${pkg.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                  <div className="space-y-2">
                    {pkg.included.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent> */}
                        <CardContent className="space-y-6">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <div className="mb-2">
                  <h3 className="font-bold">Full Wedding Coverage</h3>
                  <p className="text-2xl font-bold text-primary">£{vendor.basePrice.toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive coverage from engagement to "I do" for couples seeking a stress-free service
                  experience.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Unlimited consultations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">Full vendor coordination</span>
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
                    description: "We've sent your inquiry to the vendor. They'll contact you shortly.",
                  })
                }}
              >
                Contact Vendor
              </Button>
            </CardFooter>
          </Card>

          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{vendor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{vendor.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{vendor.website}</p>
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
            <DialogDescription>You're about to book {vendor.businessName}. Please review the details below.</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Selected Package</h4>
                <div className="rounded-md bg-muted p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">{vendor.packages.find((pkg) => pkg.id === selectedPackage)?.name}</span>
                    <span className="font-bold text-primary">
                      ${vendor.packages.find((pkg) => pkg.id === selectedPackage)?.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vendor.packages.find((pkg) => pkg.id === selectedPackage)?.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-primary" />
                  <p className="font-medium">Next Steps</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  After confirming your booking, the vendor will contact you within 24-48 hours to discuss your event
                  details and finalize arrangements.
                </p>
              </div>
            </div>
          )}

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

