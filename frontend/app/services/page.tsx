import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Calendar, Users, MapPin, Gift, Clock, Heart } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        </div>
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Our Services</h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-white/90 md:text-xl">
              Comprehensive wedding planning services tailored to your needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Offer</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From full-service planning to day-of coordination, we have a package for every couple
            </p>
          </div>

          {/* Full Planning */}
          <div id="full-planning" className="scroll-mt-20">
            <div className="grid gap-12 md:grid-cols-2 items-center mb-16 md:mb-24">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Full Wedding Planning</h3>
                <p className="mt-4 text-muted-foreground">
                  Our comprehensive planning service takes care of every detail from start to finish, allowing you to
                  enjoy your engagement without stress.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Venue Selection</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll help you find and secure the perfect venue that matches your vision and budget.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vendor Coordination</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll recommend, book, and manage all vendors, ensuring they align with your style and needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Budget Management</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll create and manage your wedding budget, tracking all expenses and payments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Design & Styling</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll develop a cohesive design concept that reflects your personality and vision.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Day-of Coordination</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll be there on your wedding day to ensure everything runs smoothly.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2 relative aspect-video overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center"></div>
            </div>
          </div>

          {/* Partial Planning */}
          <div id="partial-planning" className="scroll-mt-20">
            <div className="grid gap-12 md:grid-cols-2 items-center mb-16 md:mb-24">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Partial Planning</h3>
                <p className="mt-4 text-muted-foreground">
                  Perfect for couples who have started planning but need professional guidance to bring their vision
                  together.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Planning Consultation</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll review what you've done so far and provide guidance on next steps.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vendor Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll suggest vendors for services you still need to book.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Design Assistance</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll help refine your wedding design and ensure all elements work together.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Month-of Coordination</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll take over coordination in the final month to ensure a smooth wedding day.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Day-of Coordination */}
          <div id="day-of-coordination" className="scroll-mt-20">
            <div className="grid gap-12 md:grid-cols-2 items-center mb-16 md:mb-24">
              <div className="order-2 md:order-1">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Day-of Coordination</h3>
                <p className="mt-4 text-muted-foreground">
                  For couples who have planned their wedding but want a professional to oversee the day so they can
                  relax and enjoy.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vendor Management</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll confirm all vendors and serve as the point of contact on your wedding day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Ceremony Coordination</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll direct your ceremony rehearsal and ensure everyone knows their roles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Timeline Execution</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll create and manage a detailed timeline for your wedding day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Setup & Breakdown</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll oversee the setup of your ceremony and reception and ensure proper breakdown.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2 relative aspect-video overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
            </div>
          </div>

          {/* Vendor Management */}
          <div id="vendor-management" className="scroll-mt-20">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="relative aspect-video overflow-hidden rounded-lg">
              <div className="order-1 md:order-2 relative aspect-video overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Vendor Management</h3>
                <p className="mt-4 text-muted-foreground">
                  Let us handle the vendor selection, negotiation, and coordination process for you.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vendor Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll provide a curated list of vendors that match your style and budget.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Contract Review</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll review vendor contracts to ensure they protect your interests.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Negotiation</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll negotiate with vendors to get you the best services at the best prices.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Coordination</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll coordinate with all vendors before and during your wedding day.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
              </div>              
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Additional Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Specialized services to enhance your wedding experience
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Destination Wedding Planning",
                description:
                  "Planning a wedding away from home? We'll handle all the logistics of your destination wedding.",
                icon: <MapPin className="h-8 w-8 text-primary" />,
              },
              {
                title: "Wedding Design",
                description: "Our design services will create a cohesive and beautiful aesthetic for your wedding day.",
                icon: <Heart className="h-8 w-8 text-primary" />,
              },
              {
                title: "Guest Management",
                description: "From invitations to accommodations, we'll ensure your guests have a seamless experience.",
                icon: <Users className="h-8 w-8 text-primary" />,
              },
              {
                title: "Budget Management",
                description: "We'll help you create and stick to a realistic budget for your wedding.",
                icon: <Gift className="h-8 w-8 text-primary" />,
              },
              {
                title: "Rehearsal Dinner Planning",
                description: "We'll plan a memorable rehearsal dinner to kick off your wedding celebrations.",
                icon: <Calendar className="h-8 w-8 text-primary" />,
              },
              {
                title: "Post-Wedding Services",
                description: "From gift returns to thank you cards, we'll help with post-wedding tasks.",
                icon: <Clock className="h-8 w-8 text-primary" />,
              },
            ].map((service, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-lg bg-primary/10 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Planning?</h2>
                <p className="mt-4 text-muted-foreground">
                  Contact us today to schedule a consultation and learn how we can help make your wedding dreams come
                  true.
                </p>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1519741347686-c1e30c4aaaaed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

