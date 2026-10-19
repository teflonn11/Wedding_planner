"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  Clock,
  Globe,
  MapPin,
  PoundSterling,
  X,
  Check,
} from "lucide-react";
import { format, isEqual } from "date-fns";
import { cn } from "@/lib/utils";
import { plannerApi, utilityApi } from "@/lib/api";

interface FormData {
  plannerId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  businessName: string | null;
  // categoryId: string | null;
  description: string | null;
  website: string | null;
  location: string | null;
  // services: string[];
  basePrice: string | null;
  durationHours: number | null;
  startDate: string;
  endDate: string;
}

export default function PlannerProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // Form data
  const [formData, setFormData] = useState<FormData>({
    plannerId: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    // categoryId: null,
    description: "",
    website: "",
    location: "",
    // services: [],
    basePrice: "",
    durationHours: 0,
    startDate: "",
    endDate: "",
  });

  const dataFetchedRef = useRef(false);

  const fetchPlannerDetails = async () => {
    try {
      if (dataFetchedRef.current) return;
      
      const response = await plannerApi.getPlannerDetails();
      // console.log("planner details", response);
      if (response && response?.data?.profile) {
        const profile = response.data.profile;
        setFormData({
          plannerId: profile.plannerId || null,
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phoneNumber: profile.phoneNumber || "",
          businessName: profile.businessName || "",
          // categoryId: profile.categoryId.toString() || "",
          description: profile.description || "",
          website: profile.website || "",
          location: profile.location || "",
          // services: profile.services || [""],
          basePrice: profile.basePrice || "",
          durationHours: profile.durationHours || 0,
          startDate: profile.startDate || "",
          endDate: profile.endDate || "",
        });
        setSelectedCategory(profile.categoryId.toString());
        setSelectedServices(profile.services);
        dataFetchedRef.current = true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load planner details",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    const response = await utilityApi.getCategories();
    // console.log("categories", response);
    if (response && response?.data?.data) {
      setAvailableCategories(response.data.data);
    }
  };

  const fetchServices = async (categoryId?: string) => {
    const response = await utilityApi.getServices(categoryId);
    // console.log("services", response);
    if (response && response?.data?.data) {
      setAvailableServices(response.data.data);
    }
  };

  useEffect(() => {
    fetchPlannerDetails();
    fetchCategories();
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    // console.log("service in toggleService", service)
    setSelectedServices((prev) => {
      const services = prev || []
      // console.log("services in toggleService", services)
      if (services.includes(service)) {
        return services.filter((s: string) => s !== service)
      } else {
        return [...services, service]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formattedData = {
        ...formData,
        startDate: formData.startDate
          ? format(new Date(formData.startDate), "yyyy-MM-dd")
          : "",
        endDate: formData.endDate
          ? format(new Date(formData.endDate), "yyyy-MM-dd")
          : "",
        categoryId: selectedCategory,
        services: selectedServices,
      };

      let response;
      if (formattedData?.plannerId) {
        // console.log("updating planner", formattedData);
        response = await plannerApi.updatePlanner(formattedData);
        fetchPlannerDetails();
      } else {
        // console.log("creating planner", formattedData);
        response = await plannerApi.createPlanner(formattedData);
        fetchPlannerDetails();
      }
      // console.log("response in handleSubmit", response);
      if (response?.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description:
            response?.message || "There was an error updating your profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Planner Profile
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Planner Information</CardTitle>
            <CardDescription>
              Complete your planner profile to connect with potential clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Personal Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Business Information</h3>
                <div className="space-y-2">
                  <label htmlFor="businessName" className="text-sm font-medium">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) =>
                      value && setSelectedCategory(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem
                          key={category.categoryId}
                          value={category.categoryId.toString()}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">
                      Website <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website || ""}
                        onChange={handleInputChange}
                        required
                      />
                      <Globe className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="location"
                        name="location"
                        value={formData.location || ""}
                        onChange={handleInputChange}
                        required
                      />
                      <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Services & Pricing</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Services Provided <span className="text-red-500">*</span>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {availableServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <button
                          type="button"
                          className={`flex h-5 w-5 min-w-[20px] min-h-[20px] items-center justify-center rounded-md border ${
                            selectedServices?.includes(service)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground"
                          }`}
                          onClick={() => toggleService(service)}
                        >
                          {selectedServices?.includes(service) && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <label htmlFor={`service-${index}`} className="text-sm">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="planPrice" className="text-sm font-medium">
                      Package Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        value={formData.basePrice || ""}
                        onChange={handleInputChange}
                        required
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                      />
                      <PoundSterling className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="planDuration"
                      className="text-sm font-medium"
                    >
                      Plan Duration (hours) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="durationHours"
                        name="durationHours"
                        type="number"
                        value={formData.durationHours || ""}
                        onChange={handleInputChange}
                        required
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Availability</h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Select Available Date Range
                      </label>
                      <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="startDate" className="text-sm font-medium">
                        Start Date <span className="text-red-500">*</span>
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
                        End Date <span className="text-red-500">*</span>
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
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
