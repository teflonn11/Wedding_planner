"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Heart, Calendar, Users, MapPin, Gift } from "lucide-react"
import { useRef } from "react"
import { usersApi } from "@/lib/api"

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __testimonialInterval: ReturnType<typeof setInterval>
  }
}

export default function Home() {
  const formRef = useRef(null);
  // Function to move to the next slide
  function moveToNextSlide() {
    const slider = document.getElementById("testimonial-slider")
    if (!slider) return

    // Get current slide index from data attribute or default to 0
    const currentIndex = Number.parseInt(slider.getAttribute("data-index") || "0")
    // Calculate max index (total slides - visible slides)
    const maxIndex = 5 - 1 // 5 testimonials, showing 1 at a time on mobile
    // For desktop, we show 3 at a time, so max index would be 2
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768
    const effectiveMaxIndex = isDesktop ? 5 - 3 : maxIndex
    // Calculate new index with bounds checking
    const newIndex = Math.min(effectiveMaxIndex, currentIndex + 1)

    // If we're at the last slide, loop back to the first
    const slideIndex = newIndex >= effectiveMaxIndex ? 0 : newIndex

    // Set the transform based on the new index
    slider.style.transform = `translateX(-${slideIndex * (100 / 3)}%)`
    // Store the new index
    slider.setAttribute("data-index", slideIndex.toString())
  }

  // Function to start the auto-slide interval
  function startAutoSlide() {
    if (typeof window !== "undefined") {
      window.__testimonialInterval = setInterval(() => {
        moveToNextSlide()
      }, 5000) // Change slide every 5 seconds
    }
  }

  // Initialize auto-slide when component mounts
  if (typeof window !== "undefined") {
    // Clear any existing interval first
    if (window.__testimonialInterval) {
      clearInterval(window.__testimonialInterval)
    }

    // Wait a bit before starting to ensure the component is fully rendered
    setTimeout(() => {
      startAutoSlide()
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(formRef.current)
    // console.log('Form Data:', Object.fromEntries(formData));

    
    const payload = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      weddingDate: formData.get('wedding-date'),
      message: formData.get('message')
    }

    try {
      // Make API call here
      const response = await usersApi.contactUs(payload)

      if (!response.success) {
        alert("Failed to submit form");
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
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        </div>
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Perfect Day, <span className="text-secondary-foreground">Perfectly Planned</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-white/90 md:text-xl">
              We turn your wedding dreams into reality with our expert planning services, attention to detail, and
              personalized approach.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20" asChild>
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive wedding planning services tailored to your needs
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Full Planning</CardTitle>
                <CardDescription>From start to finish, we handle every detail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Venue selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Vendor coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Budget management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Timeline creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Day-of coordination</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/services#full-planning">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Partial Planning</CardTitle>
                <CardDescription>For couples who need help with specific aspects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Vendor recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Design consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Month-of coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Timeline assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Ceremony rehearsal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/services#partial-planning">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Day-of Coordination</CardTitle>
                <CardDescription>Peace of mind on your wedding day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Vendor management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Ceremony coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Reception setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Timeline execution</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Emergency kit</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/services#day-of-coordination">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Packages & Pricing */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Packages & Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">Choose the perfect package for your special day</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Essential</CardTitle>
                <div className="mt-4 flex items-baseline text-primary">
                  <span className="text-4xl font-extrabold tracking-tight">£1,500</span>
                  <span className="ml-1 text-xl font-semibold">/package</span>
                </div>
                <CardDescription className="mt-4">Perfect for couples who have most details planned</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Day-of coordination (10 hours)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ceremony rehearsal coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Vendor coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Detailed timeline creation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/contact">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col relative border-primary">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <div className="mt-4 flex items-baseline text-primary">
                  <span className="text-4xl font-extrabold tracking-tight">£3,500</span>
                  <span className="ml-1 text-xl font-semibold">/package</span>
                </div>
                <CardDescription className="mt-4">
                  Ideal for couples who need partial planning assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Everything in Essential package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>3 months of planning assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Vendor recommendations & management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Design consultation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Budget management assistance</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/contact">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Luxury</CardTitle>
                <div className="mt-4 flex items-baseline text-primary">
                  <span className="text-4xl font-extrabold tracking-tight">£7,000</span>
                  <span className="ml-1 text-xl font-semibold">/package</span>
                </div>
                <CardDescription className="mt-4">Complete planning from engagement to "I do"</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Everything in Premium package</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Full planning (12+ months)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Venue selection assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Custom design & styling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Unlimited consultations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/contact">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Couples Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Read about the experiences of couples who trusted us with their special day
            </p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => {
              // Pause the auto-slide when hovering
              if (typeof window !== "undefined") {
                window.clearInterval(window.__testimonialInterval)
              }
            }}
            onMouseLeave={() => {
              // Resume auto-slide when mouse leaves
              if (typeof window !== "undefined") {
                startAutoSlide()
              }
            }}
            onTouchStart={() => {
              // Pause on touch for mobile devices
              if (typeof window !== "undefined") {
                window.clearInterval(window.__testimonialInterval)
              }
            }}
            onTouchEnd={() => {
              // Resume on touch end for mobile devices
              if (typeof window !== "undefined") {
                startAutoSlide()
              }
            }}
          >
            <div className="overflow-hidden">
              <div
                className="flex flex-nowrap transition-transform duration-500 ease-in-out"
                id="testimonial-slider"
                data-index="0"
                style={{ transform: "translateX(0%)" }}
              >
                {[
                  {
                    name: "Sarah & Michael",
                    date: "June 2023",
                    rating: 5,
                    text: "Our wedding day was absolutely perfect thanks to The Dream Wedding Co. They took care of every detail so we could focus on enjoying our special day. The team was responsive, professional, and went above and beyond our expectations. Highly recommend!",
                  },
                  {
                    name: "Jessica & David",
                    date: "September 2023",
                    rating: 4,
                    text: "Working with The Dream Wedding Co was the best decision we made. They brought our vision to life and handled all the stressful parts of planning. There were a few minor hiccups with vendor coordination, but the team quickly resolved everything. Our day was magical!",
                  },
                  {
                    name: "Emily & James",
                    date: "August 2023",
                    rating: 5,
                    text: "From our first meeting to the last dance, the team was professional, creative, and attentive. They turned our dream wedding into reality and we couldn't be happier! Their attention to detail and ability to stay within our budget was impressive.",
                  },
                  {
                    name: "Olivia & William",
                    date: "October 2023",
                    rating: 4,
                    text: "The Dream Wedding Co made our destination wedding possible! Planning from across the country was stressful, but they handled everything beautifully. Communication was sometimes delayed due to time zones, but the end result exceeded our expectations.",
                  },
                  {
                    name: "Sophia & Ethan",
                    date: "May 2023",
                    rating: 5,
                    text: "We had a complex cultural fusion wedding with many moving parts, and The Dream Wedding Co executed it flawlessly. They respected both of our traditions and created a seamless celebration that honored both families. We're forever grateful!",
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-4">
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-secondary">
                            <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                              {testimonial.name.split(" ")[0][0]}&{testimonial.name.split(" ")[2][0]}
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-base">{testimonial.name}</CardTitle>
                            <CardDescription>{testimonial.date}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Heart
                              key={i}
                              className={`h-4 w-4 ${i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground">"{testimonial.text}"</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => {
                  const slider = document.getElementById("testimonial-slider")
                  // Get current slide index from data attribute or default to 0
                  const currentIndex = Number.parseInt(slider.getAttribute("data-index") || "0")
                  // Calculate new index with bounds checking
                  const newIndex = Math.max(0, currentIndex - 1)
                  // Set the transform based on the new index
                  slider.style.transform = `translateX(-${newIndex * (100 / 3)}%)`
                  // Store the new index
                  slider.setAttribute("data-index", newIndex.toString())
                }}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={() => {
                  moveToNextSlide()
                }}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Next testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let's Plan Your Perfect Day</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Ready to start planning your dream wedding? Get in touch with our team of expert planners.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">123 Wedding Lane, Celebration City, WD 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-sm text-muted-foreground">(+44) 555-123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground">info@dreamweddingco.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-bold">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <form className="space-y-4" ref={formRef} onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="first-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      name="last-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="wedding-date" className="text-sm font-medium">
                    Wedding Date
                  </label>
                  <div className="relative">
                    <input
                      id="wedding-date"
                      name="wedding-date"
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      onClick={(e) => {
                        // Use a safer approach that works across browsers
                        try {
                          // Only call showPicker if it exists (newer browsers)
                          if (typeof e.currentTarget.showPicker === "function") {
                            e.currentTarget.showPicker()
                          }
                          // For older browsers, focus is enough to show the date picker in most cases
                          e.currentTarget.focus()
                        } catch (error) {
                          // console.log("Date picker not supported in this browser")
                          // Just focus as fallback
                          e.currentTarget.focus()
                        }
                      }}
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about your wedding vision..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

