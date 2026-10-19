"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Check, DollarSign, Users, Heart, PoundSterling, PoundSterlingIcon} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { coupleApi, utilityApi } from "@/lib/api"

// Add this interface above the component
interface FormData {
  coupleId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  partnerName: string;
  location: string;
  guestCount: number;
  totalBudget: string;
  theme: string;
  colorScheme: string;
  additionalNotes: string;
  services: string[];
  startDate: string;
  endDate: string;
}

export default function CoupleProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormComplete, setIsFormComplete] = useState(false)
  // const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    coupleId: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    partnerName: "",
    location: "",
    guestCount: 0,
    totalBudget: "",
    theme: "",
    colorScheme: "",
    additionalNotes: "",
    services: [],
    startDate: "",
    endDate: "",
  })
  const [availableServices, setAvailableServices] = useState<any[]>([])


  // Add useEffect to fetch couple details

  const fetchCoupleDetails = async () => {
    try {
      const response = await coupleApi.getCoupleDetails()
      // console.log("couple details", response)
      if (response && response?.data?.profile) {
        setFormData(prev => ({
          ...prev,
          ...response.data.profile,
        }))
        // setIsSaved(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load couple details",
        variant: "destructive",
      })
    }
  }

  const fetchServices = async () => {
    const response = await utilityApi.getServices()
    // console.log("services", response)
    if (response && response?.data?.data) {
      setAvailableServices(response.data.data)
    }
  }

  useEffect(() => {
    fetchCoupleDetails()
    fetchServices();
  }, [toast])

  // Check if form is complete whenever form data changes
  useEffect(() => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "partnerName",
      "location",
      "guestCount",
      "totalBudget",
      "services",
      "startDate",
      "endDate",
    ]

    const isComplete =
      requiredFields.every((field) => {
        const value = formData[field as keyof typeof formData];
        return value && (Array.isArray(value) ? value.length > 0 : String(value).trim() !== "");
      })

    setIsFormComplete(isComplete as boolean)
  }, [formData])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleService = (service: string) => {
    // console.log("service in toggleService", service)
    setFormData((prev) => {
      const services = prev.services || [] // Handle case when services is undefined
      // console.log("services in toggleService", services)
      if (services.includes(service)) {
        return { ...prev, services: services.filter((s) => s !== service) }
      } else {
        return { ...prev, services: [...services, service] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Format dates before sending
      const formattedData = {
        ...formData,
        startDate: formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : '',
        endDate: formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : ''
      }
      
      let response;
      if(formattedData?.coupleId){
        // console.log("updating couple")
        response = await coupleApi.updateCouple(formattedData)
        fetchCoupleDetails();
      } else {
        // console.log("creating couple")
        response = await coupleApi.createCouple(formattedData)
        fetchCoupleDetails()
      }
      // console.log("response in handleSubmit", response)
      if(response?.success){
        // setIsSaved(true)
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: response?.message || "There was an error updating your profile",
          variant: "destructive",
        })
      }


    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Couple Profile</h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to get personalized wedding planning assistance
            </p>
          </div>
          {isFormComplete && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5">
              Profile Complete
            </Badge>
          )}
        </div>

        {/* Marketplace Access Notice */}
        {!isFormComplete && <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Heart className="h-5 w-5 text-primary" />
          <AlertTitle>Complete your profile to unlock our wedding marketplace</AlertTitle>
          <AlertDescription>
            Fill in all required fields and save your profile to gain access to our curated selection of wedding vendors
            and planners.
          </AlertDescription>
        </Alert>}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Tell us about you and your partner</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="spouseName" className="text-sm font-medium">
                    Spouse/Partner Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="spouseName"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Wedding Details</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Booking Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="text-sm font-medium">
                        Start Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate ? new Date(formData.startDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setFormData(prev => ({
                                  ...prev,
                                  startDate: format(date, 'yyyy-MM-dd'),
                                  // If end date is before start date, update it
                                  endDate: prev.endDate && new Date(prev.endDate) <= date
                                    ? format(new Date(date.setDate(date.getDate() + 1)), 'yyyy-MM-dd')
                                    : prev.endDate
                                }))
                              }
                            }}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="endDate" className="text-sm font-medium">
                        End Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate ? new Date(formData.endDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setFormData(prev => ({
                                  ...prev,
                                  endDate: format(date, 'yyyy-MM-dd')
                                }))
                              }
                            }}
                            initialFocus
                            disabled={(date) => (formData.startDate ? date <= new Date(formData.startDate) : date < new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    required
                  />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="guestCount" className="text-sm font-medium">
                      Estimated Guest Count <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="guestCount"
                        name="guestCount"
                        type="number"
                        value={formData.guestCount}
                        onChange={handleInputChange}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                        required
                      />
                      <Users className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="totalBudget" className="text-sm font-medium">
                      Total Budget (<PoundSterlingIcon className="inline-block h-4 w-4" />) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="totalBudget"
                        name="totalBudget"
                        type="number"
                        value={formData.totalBudget}
                        onChange={handleInputChange}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                        required
                      />
                      <PoundSterling className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="weddingTheme" className="text-sm font-medium">
                    Wedding Theme (Optional)
                  </label>
                  <Input
                    id="weddingTheme"
                    name="weddingTheme"
                    placeholder="e.g., Rustic, Beach, Garden, Modern"
                    value={formData.theme}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="colorTheme" className="text-sm font-medium">
                    Color Theme (Optional)
                  </label>
                  <Input
                    id="colorTheme"
                    name="colorScheme"
                    placeholder="e.g., Blush & Gold, Navy & Burgundy"
                    value={formData.colorScheme}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Services Needed <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {availableServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <button
                          type="button"
                          className={`flex h-5 w-5 min-w-[20px] min-h-[20px] items-center justify-center rounded-md border ${
                            formData?.services?.includes(service)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}
                          onClick={() => toggleService(service)}
                        >
                          {formData?.services?.includes(service) && <Check className="h-3.5 w-3.5" />}
                        </button>
                        <label className="flex items-center text-sm gap-1.5">
                          {/* {service.icon} */}
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="additionalNotes" className="text-sm font-medium">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    placeholder="Any other details or special requests for your wedding"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {isFormComplete && (
          <Card className="mt-8 border-primary/20">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Ready to Plan Your Dream Wedding?
              </CardTitle>
              <CardDescription>
                Now that your profile is complete, explore our network of vendors and planners to make your wedding
                perfect.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-medium">Find Your Perfect Vendors</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our curated selection of photographers, caterers, florists, and more to bring your wedding
                    vision to life.
                  </p>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Compare prices and packages</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Read verified reviews</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>View portfolios and galleries</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium">Connect with Expert Planners</h3>
                  <p className="text-sm text-muted-foreground">
                    Find the perfect wedding planner to guide you through the entire process and ensure your day is
                    stress-free.
                  </p>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Full-service and day-of coordination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Personalized planning experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Budget management expertise</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 bg-muted/20 rounded-b-lg">
              <Button onClick={() => router.push("/vendors")} className="w-full sm:flex-1">
                Explore Vendors
              </Button>
              <Button onClick={() => router.push("/planners")} className="w-full sm:flex-1">
                Explore Planners
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* {!isSaved && isFormComplete && (
          <Alert className="mt-8">
            <AlertTitle>Your profile is ready to be saved</AlertTitle>
            <AlertDescription>
              Please save your profile to unlock access to our vendor and planner marketplace.
            </AlertDescription>
          </Alert>
        )} */}
      </div>
    </div>
  )
}

