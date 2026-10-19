"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Filter, Search, AlertTriangle, Users, PoundSterling } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { bookingApi, utilityApi, vendorApi } from "@/lib/api"
import { format } from "date-fns"

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  // const [priceRange, setPriceRange] = useState("all")
  const [selectedVendors, setSelectedVendors] = useState<number[]>([])
  const [totalBudget, setTotalBudget] = useState(30000) // Default budget from couple profile
  const [spentBudget, setSpentBudget] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showBudgetWarning, setShowBudgetWarning] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [availableServices, setAvailableServices] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<string>("all")

  useEffect(() => {
    const fetchVendors = async () => {
      const response = await vendorApi.getVendors();
      // console.log("response in fetchVendors", response)
      if (response && response?.data?.vendors) {
        setVendors(response.data.vendors)
      }
      if (response && response?.data?.coupleBudget) {
        setTotalBudget(Number(response.data.coupleBudget))
      }
    }
    const fetchCategories = async () => {
      const response = await utilityApi.getCategories();
      // console.log("categories", response);
      if (response && response?.data?.data) {
        setAvailableCategories(response.data.data);
      }
    };

    const fetchServices = async () => {
      const response = await utilityApi.getServices()
      // console.log("services", response)
      if (response && response?.data?.data) {
        setAvailableServices(response.data.data)
      }
    }
    fetchVendors()
    fetchCategories()
    fetchServices()
  }, [])

  // Function to get random image based on vendor type
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

  // Update spent budget whenever selected vendors change
  useEffect(() => {
    const newSpentBudget = selectedVendors.reduce((total, vendorId) => {
      const vendor = vendors.find((v) => v.vendorId === vendorId)
      return total + (Number(vendor?.basePrice) || 0)
    }, 0)

    setSpentBudget(newSpentBudget)

    // Show a warning if over budget
    if (newSpentBudget > totalBudget && selectedVendors.length > 0) {
      toast({
        title: "Budget Warning",
        description: "You've exceeded your total wedding budget.",
        variant: "destructive",
      })
    }
  }, [selectedVendors, toast])

  // Filter vendors based on search term, category, and price range
  const filteredVendors = vendors?.filter((vendor) => {
    const matchesSearch =
      vendor?.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor?.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || vendor.categoryName === selectedCategory

    const matchesServices = selectedServices === "all" || vendor.services.includes(selectedServices)

    // const matchesPriceRange =
    //   priceRange === "all" ||
    //   (priceRange === "$" && vendor.priceRange === "$") ||
    //   (priceRange === "$$" && vendor.priceRange === "$$") ||
    //   (priceRange === "$$$" && vendor.priceRange === "$$$") ||
    //   (priceRange === "$$$$" && vendor.priceRange === "$$$$")

    return matchesSearch && matchesCategory && matchesServices
  })

  // Toggle vendor selection
  const toggleVendorSelection = (vendorId: number) => {
    setSelectedVendors((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId)
      } else {
        return [...prev, vendorId]
      }
    })
  }

  // Handle booking creation
  const handleCreateBooking = () => {
    if (isOverBudget) {
      setShowBudgetWarning(true)
    } else {
      // Proceed with booking
      proceedWithBooking()
    }
  }

  // Function to proceed with booking after confirmation
  const proceedWithBooking = async () => {
    // Store selected vendors in session storage or context
    // This is simplified for the demo - in a real app you'd use a more robust state management solution
    const selectedVendorData = vendors.filter((vendor) => selectedVendors.includes(vendor.vendorId))
    // console.log("selectedVendorData", selectedVendorData);
    // sessionStorage.setItem("selectedVendors", JSON.stringify(selectedVendorData))

   const bookingPayload =  {
      "vendorId": selectedVendorData?.map(vendor => vendor.vendorId) ?? [],
      "bookingDate": format(new Date(), 'yyyy-MM-dd'),
      "notes": "",
      "totalPrice": spentBudget,
  }

  // console.log("bookingpayload", bookingPayload);

  const response = await bookingApi.createBooking(bookingPayload)

  console.log("booking create response", response);

  if(response.success && response?.data?.bookingId){
    const bookingId = response.data.bookingId;
    toast({
      title: response?.data?.message ?? "Proceeding to checkout",
      description: "Redirecting to booking confirmation page...",
    })
    // Redirect to booking confirmation page
    router.push(`/booking/confirmation?id=${bookingId}`)
  } else {
    // console.log("error in bookiung", response);
    toast({
      title: "Try Again!",
      description: response?.message ?? "Error occurred while creating booking!",
      variant: "destructive",
    })
  }

    // Close modal if it was open
    setShowBudgetWarning(false)
  }

  // Calculate budget stats
  const budgetPercentage = Math.min(Math.round((spentBudget / totalBudget) * 100), 100)
  const remainingBudget = totalBudget - spentBudget
  const isOverBudget = spentBudget > totalBudget

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wedding Vendors</h1>
            <p className="text-muted-foreground mt-1">Find the perfect vendors for your special day</p>
          </div>
          <Button onClick={() => router.push("/profile/couple")} variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Update Profile & Budget</span>
          </Button>
        </div>

        {/* Budget Monitor */}
        <div className="mb-8 p-4 bg-background border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <PoundSterling className="h-5 w-5 mr-1 text-primary" />
            Budget Monitor
          </h2>
          <div className="grid gap-2 md:grid-cols-3 mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="font-semibold">£{totalBudget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className={`font-semibold ${isOverBudget ? "text-destructive" : ""}`}>
                £{spentBudget.toLocaleString()}
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
                <span>You're over budget by £{Math.abs(remainingBudget).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Filters */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="florist">Florist</SelectItem>
                      <SelectItem value="catering">Catering</SelectItem>
                      <SelectItem value="music">Music/DJ</SelectItem>
                      <SelectItem value="venue">Venue</SelectItem>
                      <SelectItem value="cake">Cake/Bakery</SelectItem>
                    </SelectContent>
                  </Select> */}
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem
                          key={category.categoryId}
                          value={category.categoryName}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Services</label>
                  <Select
                    value={selectedServices}
                    onValueChange={setSelectedServices}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      {availableServices.map((service) => (
                        <SelectItem
                          key={service}
                          value={service}
                        >
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="City, State" onChange={(e) => setSearchTerm(e.target.value)} />
                </div> */}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedServices("all")
                  }}
                >
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our wedding planners can help you find the perfect vendors for your special day.
                </p>
                <Button className="w-full" onClick={() => router.push("/planners")}>
                  Find a Planner
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Listings */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs
                defaultValue="grid"
                value={viewMode}
                onValueChange={(value) => setViewMode(value as "grid" | "list")}
                className="hidden sm:block"
              >
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed p-8">
                <div className="mb-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any vendors matching your criteria. Try adjusting your filters or explore our
                  planners who can help you find the perfect vendors.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedServices("all")
                    }}
                  >
                    Reset filters
                  </Button>
                  <Button onClick={() => router.push("/planners")}>Explore Planners</Button>
                </div>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
                {filteredVendors.map((vendor) => (
                  <Card
                    key={vendor.vendorId}
                    className={`overflow-hidden transition-all duration-200 cursor-pointer ${
                      selectedVendors.includes(vendor.vendorId) ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"
                    } ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}
                    onClick={() => toggleVendorSelection(vendor.vendorId)}
                  >
                    <div
                      className={`${viewMode === "list" ? "w-full md:w-1/3" : "aspect-video"} relative overflow-hidden`}
                    >
                      <img
                        src={getRandomImage(vendor.categoryName.toLowerCase()) || "/placeholder.svg"}
                        alt={vendor.businessName}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                      />
                      {/* {vendor.featured && <Badge className="absolute top-2 right-2 bg-primary">Featured</Badge>} */}
                      {selectedVendors.includes(vendor.vendorId) && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <Badge className="bg-primary text-lg px-4 py-2">Selected</Badge>
                        </div>
                      )}
                    </div>
                    <div className={`flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{vendor.businessName}</CardTitle>
                          {vendor.rating && <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="text-sm font-medium">{vendor.rating}</span>
                          </div>}
                        </div>
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {vendor.location}
                        </p>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm text-muted-foreground">{vendor.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {vendor.categoryName.charAt(0).toUpperCase() + vendor.categoryName.slice(1)}
                            </Badge>
                            {/* <Badge variant="outline" className="text-xs">
                              {vendor.priceRange}
                            </Badge> */}
                          </div>
                          <p className="font-medium text-primary">£{vendor.basePrice.toLocaleString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/20 pt-4 mt-auto">
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/vendors/${vendor.vendorId}`)
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant={selectedVendors.includes(vendor.vendorId) ? "destructive" : "default"}
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleVendorSelection(vendor.vendorId)
                            }}
                          >
                            {selectedVendors.includes(vendor.vendorId) ? "Remove" : "Select"}
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Create Booking CTA */}
      {selectedVendors.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
          <Button
            size="lg"
            onClick={handleCreateBooking}
            className={`shadow-lg ${isOverBudget ? "bg-destructive hover:bg-destructive/90" : ""}`}
          >
            Create Booking ({selectedVendors.length} vendor{selectedVendors.length > 1 ? "s" : ""})
          </Button>
        </div>
      )}

      {/* Budget Warning Modal */}
      <Dialog open={showBudgetWarning} onOpenChange={setShowBudgetWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Budget Warning
            </DialogTitle>
            <DialogDescription>
              You're over budget by £{Math.abs(remainingBudget).toLocaleString()}. Are you sure you want to proceed with
              this booking?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowBudgetWarning(false)} className="sm:flex-1">
              Cancel
            </Button>
            <Button onClick={proceedWithBooking} variant="destructive" className="sm:flex-1">
              Continue Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

