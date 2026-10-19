"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function PlannerProfileForm() {
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
        description: "Your planner profile has been updated successfully",
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
        <h3 className="font-medium text-lg">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="first-name" className="text-sm font-medium">
              First Name
            </label>
            <Input id="first-name" defaultValue="Emily" />
          </div>
          <div className="space-y-2">
            <label htmlFor="last-name" className="text-sm font-medium">
              Last Name
            </label>
            <Input id="last-name" defaultValue="Johnson" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" defaultValue="emily@dreamweddingplanners.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input id="phone" type="tel" defaultValue="(+44) 555-123-4567" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Job Title
          </label>
          <Input id="title" defaultValue="Lead Wedding Planner" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Professional Information</h3>
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            Professional Bio
          </label>
          <Textarea
            id="bio"
            defaultValue="With over 10 years of experience in wedding planning, I specialize in creating personalized, stress-free wedding experiences. My attention to detail and creative approach ensures that each wedding I plan is unique and memorable. I'm passionate about turning couples' visions into reality and making the planning process enjoyable."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium">
            Years of Experience
          </label>
          <Input id="experience" type="number" defaultValue="10" />
        </div>
        <div className="space-y-2">
          <label htmlFor="specialties" className="text-sm font-medium">
            Specialties
          </label>
          <Input id="specialties" defaultValue="Destination Weddings, Luxury Weddings, Cultural Weddings" />
        </div>
        <div className="space-y-2">
          <label htmlFor="certifications" className="text-sm font-medium">
            Certifications
          </label>
          <Input
            id="certifications"
            defaultValue="Certified Wedding Planner (CWP), Certified Destination Wedding Specialist"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg">Service Information</h3>
        <div className="space-y-2">
          <label htmlFor="service-area" className="text-sm font-medium">
            Service Area
          </label>
          <Input id="service-area" defaultValue="Greater Miami Area, Destination Weddings Worldwide" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Services Offered</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "Full Wedding Planning",
              "Partial Planning",
              "Day-of Coordination",
              "Destination Wedding Planning",
              "Vendor Management",
              "Budget Management",
              "Timeline Creation",
              "Rehearsal Coordination",
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
          <label htmlFor="languages" className="text-sm font-medium">
            Languages Spoken
          </label>
          <Input id="languages" defaultValue="English, Spanish" />
        </div>
        <div className="space-y-2">
          <label htmlFor="portfolio" className="text-sm font-medium">
            Portfolio Link
          </label>
          <Input id="portfolio" type="url" defaultValue="https://www.dreamweddingplanners.com/emily-portfolio" />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  )
}

