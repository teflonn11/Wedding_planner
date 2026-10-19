"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function VendorProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Profile updated",
        description: "Your vendor profile has been updated successfully",
      })
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Business Information</h3>
        <div className="space-y-2">
          <label htmlFor="business-name" className="text-sm font-medium">
            Business Name
          </label>
          <Input id="business-name" defaultValue="Elegant Events Photography" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-sm font-medium">
              Contact Name
            </label>
            <Input id="contact-name" defaultValue="David Wilson" />
          </div>
          <div className="space-y-2">
            <label htmlFor="business-type" className="text-sm font-medium">
              Business Type
            </label>
            <select
              id="business-type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue="photography"
            >
              <option value="photography">Photography</option>
              <option value="videography">Videography</option>
              <option value="catering">Catering</option>
              <option value="florist">Florist</option>
              <option value="venue">Venue</option>
              <option value="music">Music/Entertainment</option>
              <option value="cake">Cake/Bakery</option>
              <option value="decor">Decor/Rentals</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="business-description" className="text-sm font-medium">
            Business Description
          </label>
          <Textarea
            id="business-description"
            defaultValue="Elegant Events Photography specializes in capturing timeless, romantic wedding moments with a photojournalistic approach. With over 10 years of experience, we pride ourselves on our attention to detail and ability to tell your unique love story through our images."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Contact Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" defaultValue="info@eleganteventsphoto.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input id="phone" type="tel" defaultValue="(555) 234-5678" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <Input id="website" type="url" defaultValue="https://www.eleganteventsphoto.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Business Address
          </label>
          <Input id="address" defaultValue="456 Creative Ave, Suite 101" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <Input id="city" defaultValue="Artville" />
          </div>
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <Input id="state" defaultValue="CA" />
          </div>
          <div className="space-y-2">
            <label htmlFor="zip" className="text-sm font-medium">
              ZIP Code
            </label>
            <Input id="zip" defaultValue="90210" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Service Details</h3>
        <div className="space-y-2">
          <label htmlFor="service-area" className="text-sm font-medium">
            Service Area
          </label>
          <Input id="service-area" defaultValue="Greater Los Angeles Area, Willing to travel" />
        </div>
        <div className="space-y-2">
          <label htmlFor="price-range" className="text-sm font-medium">
            Price Range
          </label>
          <select
            id="price-range"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue="$$"
          >
            <option value="$">$ (Budget-friendly)</option>
            <option value="$$">$$ (Mid-range)</option>
            <option value="$$$">$$$ (Premium)</option>
            <option value="$$$$">$$$$ (Luxury)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Services Offered</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Wedding Photography",
              "Engagement Sessions",
              "Bridal Portraits",
              "Destination Weddings",
              "Photo Albums",
              "Digital Files",
              "Prints & Canvases",
              "Second Photographer",
            ].map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`service-${index}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <label htmlFor={`service-${index}`} className="text-sm">
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="portfolio" className="text-sm font-medium">
            Portfolio Link
          </label>
          <Input id="portfolio" type="url" defaultValue="https://www.eleganteventsphoto.com/portfolio" />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}

