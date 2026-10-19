"use client";

import { useEffect, useState } from "react";
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
  PoundSterlingIcon,
  X,
} from "lucide-react";
import { format, isEqual } from "date-fns";
import { cn } from "@/lib/utils";
import { utilityApi, vendorApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface FormData {
  vendorId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  // categoryId: string;
  description: string;
  website: string;
  location: string;
  // services: string[];
  basePrice: string;
  durationHours: number;
  startDate: string;
  endDate: string;
}

export default function VendorProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const [formData, setFormData] = useState<FormData>({
    vendorId: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    businessName: "",
    // categoryId: "",
    description: "",
    website: "",
    location: "",
    // services: [""],
    basePrice: "",
    durationHours: 0,
    startDate: "",
    endDate: "",
  });

  const fetchVendorDetails = async () => {
    try {
      const response = await vendorApi.getVendorDetails();      
      if (response?.data?.profile) {
        const profile = response.data.profile;
        setFormData({
          vendorId: profile.vendorId || null,
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
        setSelectedService(profile.services[0]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load vendor details",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    const response = await utilityApi.getCategories();
    if (response && response?.data?.data) {
      setAvailableCategories(response.data.data);
    }
  };

  const fetchServices = async () => {
    const response = await utilityApi.getServices();
    if (response && response?.data?.data) {
      setAvailableServices(response.data.data);
    }
  };

  useEffect(() => {
    fetchVendorDetails();
    fetchCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "businessName",
      "location",
      "categoryId",
      "website",
      "services",
      "basePrice",
      "durationHours",
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        services: [selectedService],
      };

      let response;
      if (formattedData?.vendorId) {
        response = await vendorApi.updateVendor(formattedData);
        fetchVendorDetails();
      } else {
        response = await vendorApi.createVendor(formattedData);
        fetchVendorDetails();
      }
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

  const handleCategoryChange = (value: string) => {
    if(value) {
      setSelectedCategory(value);
    }
  };
  
  const handleServiceChange = (value: string) => {
    if(value) {
      setSelectedService(value);
    }
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* <h1 className="text-3xl font-bold tracking-tight mb-8">
          Vendor Profile
        </h1> */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Profile</h1>
          </div>
          {isFormComplete && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5">
              Profile Complete
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>
              Complete your vendor profile to connect with potential clients
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
                      value={formData.firstName ?? ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName ?? ""}
                      onChange={handleInputChange}
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
                      value={formData.email ?? ""}
                      onChange={handleInputChange}
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
                      value={formData.phoneNumber ?? ""}
                      onChange={handleInputChange}
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
                    value={formData.businessName ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
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
                    value={formData.description ?? ""}
                    onChange={handleInputChange}
                    rows={4}
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
                        value={formData.website ?? ""}
                        onChange={handleInputChange}
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
                        value={formData.location ?? ""}
                        onChange={handleInputChange}
                      />
                      <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Service Details</h3>
                <div className="space-y-2">
                  <label
                    htmlFor="serviceProvided"
                    className="text-sm font-medium"
                  >
                    Service Provided <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedService}
                    onValueChange={handleServiceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service provided" />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="servicePrice"
                      className="text-sm font-medium"
                    >
                      Service Price (
                      <PoundSterlingIcon className="inline-block h-4 w-4" />) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="basePrice"
                        name="basePrice"
                        type="number"
                        value={Number(formData.basePrice) ?? 0}
                        onChange={handleInputChange}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                        required
                      />
                      <PoundSterling className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="serviceDuration"
                      className="text-sm font-medium"
                    >
                      Service Duration (hours) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="durationHours"
                        name="durationHours"
                        type="number"
                        value={formData.durationHours ?? 0}
                        onChange={handleInputChange}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        min="1"
                        required
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
                          <label
                            htmlFor="startDate"
                            className="text-sm font-medium"
                          >
                            Start Date <span className="text-red-500">*</span>
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formData.startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.startDate ? (
                                  format(
                                    new Date(formData.startDate),
                                    "yyyy-MM-dd"
                                  )
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData.startDate
                                    ? new Date(formData.startDate)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      startDate: format(date, "yyyy-MM-dd"),
                                      // If end date is before start date, update it
                                      endDate:
                                        prev.endDate &&
                                        new Date(prev.endDate) <= date
                                          ? format(
                                              new Date(
                                                date.setDate(date.getDate() + 1)
                                              ),
                                              "yyyy-MM-dd"
                                            )
                                          : prev.endDate,
                                    }));
                                  }
                                }}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="endDate"
                            className="text-sm font-medium"
                          >
                            End Date <span className="text-red-500">*</span>
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formData.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.endDate ? (
                                  format(
                                    new Date(formData.endDate),
                                    "yyyy-MM-dd"
                                  )
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData.endDate
                                    ? new Date(formData.endDate)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  if (date) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      endDate: format(date, "yyyy-MM-dd"),
                                    }));
                                  }
                                }}
                                initialFocus
                                disabled={(date) =>
                                  formData.startDate
                                    ? date <= new Date(formData.startDate)
                                    : date < new Date()
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* {availabilityDates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Added Availability</h4>
                    <div className="space-y-3">
                      {availabilityDates.map((avail, index) => (
                        <div
                          key={index}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                        >
                          <div>
                            <div className="font-medium">
                              {`${format(
                                (avail.dates as any).from,
                                "PPP"
                              )} - ${format((avail.dates as any).to, "PPP")}`}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAvailability(index)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
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
