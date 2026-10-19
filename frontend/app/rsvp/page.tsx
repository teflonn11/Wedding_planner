"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useRef, useEffect, useState } from "react"
import { usersApi, isAuthenticated, getUserData, coupleApi } from "@/lib/api"
import { useSearchParams } from "next/navigation"

export default function RsvpPage() {
  const formRef = useRef(null);
  const rsvpFormRef = useRef(null);
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const searchParams = useSearchParams()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Get user data from localStorage
        const userData = getUserData()
        if (userData) {
          setUser(userData)
          setIsLoggedIn(true)
        }
      }
    }

    checkAuth()
  }, [])

  const handleRsvpSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(rsvpFormRef.current)
    // console.log('Form Data:', Object.fromEntries(formData));
    const payload = {
      emails: [formData.get('email')],
    }

    // console.log('Payload:', payload);
    const response = await coupleApi.sendRsvpEmail(payload)
    // console.log('Response:', response);
    if (response.success) {
      alert(response?.message || 'RSVP email sent successfully')
      toast({
        title: 'Success',
        description: response?.message || 'RSVP email sent successfully',
      })
    } else {
      toast({
        title: 'Error',
        description: response?.message || 'Failed to send RSVP email',
      })
    }
    rsvpFormRef.current.reset()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(formRef.current)
    // console.log('Form Data:', Object.fromEntries(formData));

    const coupleId = searchParams.get('cu')
    const payload = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      phoneNumber: formData.get('phone'),
      plusOnes: formData.get('guests'),
      address: formData.get('address'),
      message: formData.get('message'),
      status: formData.get('attending-yes') ? 'yes' : 'no',
      dietaryRestrictions: formData.get('dietary-restrictions'),
      coupleId: coupleId,
    }

    // console.log('Payload:', payload);

    try {
      // Make API call here
      const response = await usersApi.contactUs(payload)

      if (!response.success) {
        toast({
          title: 'Error',
          description: 'Failed to submit form',
        })
      } else {
        // console.log('Form submitted successfully')
        alert('Contact details submitted successfully. Our team will get back to you within 24 hours')
        // toast({
        //   title: 'Thank you for contacting us',
        //   description: 'We will get back to you within 24 hours',
        // })
        formRef.current.reset();
        // e.currentTarget.reset()
      }

      // Handle success (you can add toast notification or redirect)
      // console.log('Form submitted successfully')
      
    } catch (error) {
      // Handle error (you can add toast notification)
      console.error('Error submitting form:', error)
    }
  }
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509927083803-4bd519298ac4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8Hx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        </div>
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">RSVP</h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-white/90 md:text-xl">
              Let us know if you'll be joining the celebration
            </p>
          </div>
        </div>
      </section>

      {/* Couple's RSVP Management Section - Only shown when authenticated as couple */}
      {isLoggedIn && user && (user.roleId === "1" || user.roleId === 1) && (
        <section className="py-16 md:py-24">
          <div className="container max-w-3xl">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Wedding RSVP</CardTitle>
                <CardDescription>Please fill out this form to send RSVP to guests</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleRsvpSend} ref={rsvpFormRef}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Send RSVP
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* RSVP Form */}
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Wedding RSVP</CardTitle>
              <CardDescription>Please fill out this form to let us know if you'll be attending</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
                {/* <div className="space-y-2">
                  <label htmlFor="event-code" className="text-sm font-medium">
                    Event Code
                  </label>
                  <Input id="event-code" placeholder="Enter the event code from your invitation" />
                </div> */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" name="first-name" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" name="last-name" placeholder="Doe" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="(+44) 555-123-4567" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input id="address" name="address" placeholder="Please enter your address" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Will you be attending?</label>
                  <RadioGroup defaultValue="yes">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="attending-yes" />
                      <Label htmlFor="attending-yes">Yes, I'll be there</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="attending-no" />
                      <Label htmlFor="attending-no">No, I can't make it</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <label htmlFor="guests" className="text-sm font-medium">
                    Number of Guests (including yourself)
                  </label>
                  <Input id="guests" name="guests"  type="number" min="1" max="10" defaultValue="1" />
                </div>

                {/* <div className="space-y-3">
                  <label className="text-sm font-medium">Meal Preference</label>
                  <RadioGroup defaultValue="chicken">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chicken" id="meal-chicken" />
                      <Label htmlFor="meal-chicken">Chicken</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beef" id="meal-beef" />
                      <Label htmlFor="meal-beef">Beef</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fish" id="meal-fish" />
                      <Label htmlFor="meal-fish">Fish</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="meal-vegetarian" />
                      <Label htmlFor="meal-vegetarian">Vegetarian</Label>
                    </div>
                  </RadioGroup>
                </div> */}

                <div className="space-y-2">
                  <label htmlFor="dietary-restrictions" className="text-sm font-medium">
                    Dietary Restrictions or Allergies
                  </label>
                  <Textarea id="dietary-restrictions" name="dietary-restrictions" placeholder="Please list any dietary restrictions or allergies" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message to the Couple
                  </label>
                  <Textarea id="message" name="message" placeholder="Share your well wishes or a special message" />
                </div>

                <Button type="submit" className="w-full">
                  Submit RSVP
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Information */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Important Information</h2>
            <p className="mt-4 text-lg text-muted-foreground">Details to help you plan your attendance</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Deadline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please submit your RSVP by the date indicated on your invitation, typically 4-6 weeks before the
                  wedding date. This helps us finalize arrangements with our vendors.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Plus Ones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We respectfully request that only those guests named on the invitation attend. If you have any
                  questions about plus ones, please contact the couple directly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Children</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please check your invitation to see if children are included. If your invitation is addressed to you
                  and your partner only, we have planned an adults-only celebration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have any questions about the RSVP process or need to update your response after submitting,
                  please contact us at rsvp@dreamweddingco.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

