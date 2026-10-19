"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "lucide-react"

export default function CoupleProfileForm() {
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
        description: "Your profile has been updated successfully",
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
        <h3 className="font-medium text-lg">Partner 1 Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="partner1-first-name" className="text-sm font-medium">
              First Name
            </label>
            <Input id="partner1-first-name" defaultValue="Sarah" />
          </div>
          <div className="space-y-2">
            <label htmlFor="partner1-last-name" className="text-sm font-medium">
              Last Name
            </label>
            <Input id="partner1-last-name" defaultValue="Johnson" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="partner1-email" className="text-sm font-medium">
            Email
          </label>
          <Input id="partner1-email" type="email" defaultValue="sarah@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="partner1-phone" className="text-sm font-medium">
            Phone
          </label>
          <Input id="partner1-phone" type="tel" defaultValue="(+44) 555-123-4567" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Partner 2 Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="partner2-first-name" className="text-sm font-medium">
              First Name
            </label>
            <Input id="partner2-first-name" defaultValue="Michael" />
          </div>
          <div className="space-y-2">
            <label htmlFor="partner2-last-name" className="text-sm font-medium">
              Last Name
            </label>
            <Input id="partner2-last-name" defaultValue="Smith" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="partner2-email" className="text-sm font-medium">
            Email
          </label>
          <Input id="partner2-email" type="email" defaultValue="michael@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="partner2-phone" className="text-sm font-medium">
            Phone
          </label>
          <Input id="partner2-phone" type="tel" defaultValue="(555) 987-6543" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Wedding Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="wedding-date" className="text-sm font-medium">
              Wedding Date
            </label>
            <div className="relative">
              <Input id="wedding-date" type="date" defaultValue="2024-06-15" />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="guest-count" className="text-sm font-medium">
              Estimated Guest Count
            </label>
            <Input id="guest-count" type="number" defaultValue="150" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="wedding-location" className="text-sm font-medium">
            Wedding Location
          </label>
          <Input id="wedding-location" defaultValue="Sunset Beach Resort, Miami FL" />
        </div>
        <div className="space-y-2">
          <label htmlFor="wedding-vision" className="text-sm font-medium">
            Wedding Vision
          </label>
          <Textarea
            id="wedding-vision"
            defaultValue="We're dreaming of a beach wedding with a romantic sunset ceremony followed by a reception under the stars. We want a relaxed, elegant atmosphere with a color palette of blues, corals, and golds."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="budget" className="text-sm font-medium">
            Budget Range
          </label>
          <select
            id="budget"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue="30000-50000"
          >
            <option value="under-10000">Under $10,000</option>
            <option value="10000-20000">$10,000 - $20,000</option>
            <option value="20000-30000">$20,000 - $30,000</option>
            <option value="30000-50000">$30,000 - $50,000</option>
            <option value="50000-plus">$50,000+</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}

