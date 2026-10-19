'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { usersApi } from "@/lib/api"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRef } from "react"

export default function ContactPage() {
  const formRef = useRef(null);
  const { toast } = useToast()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(formRef.current)
    // console.log('Form Data:', Object.fromEntries(formData));

    
    const payload = {
      firstName: formData.get('first-name'),
      lastName: formData.get('last-name'),
      email: formData.get('email'),
      phoneNumber: formData.get('phone'),
      weddingDate: formData.get('wedding-date'),
      service: formData.get('service'),
      message: formData.get('message')
    }

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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522413452208-996ff3f3e740?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        </div>
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Contact Us</h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-white/90 md:text-xl">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="first-name" name="first-name" placeholder="John" required/>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="last-name" name="last-name" placeholder="Doe" required/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <div className="flex">
                      <div className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                        +44
                      </div>
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        placeholder="7911 123456"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="wedding-date" className="text-sm font-medium">
                      Wedding Date (if known)
                    </label>
                    <Input id="wedding-date" name="wedding-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a service</option>
                      <option value="full-planning">Full Planning</option>
                      <option value="partial-planning">Partial Planning</option>
                      <option value="day-of-coordination">Day-of Coordination</option>
                      <option value="vendor-management">Vendor Management</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your wedding vision..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Contact Information</h2>
                <p className="mt-2 text-muted-foreground">Reach out to us through any of the following methods.</p>
              </div>
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Our Office</h3>
                    <address className="not-italic text-muted-foreground">
                      <p>123 Wedding Lane</p>
                      <p>Celebration City, WD 12345</p>
                    </address>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">(+44) 555-123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@dreamweddingco.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Office Hours</h3>
                    <div className="text-muted-foreground">
                      <p>Monday - Friday: 9am - 6pm</p>
                      <p>Saturday: 10am - 4pm</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 aspect-video overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215266754809!2d-73.98776708459473!3d40.757977979326224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1649361331227!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about our services</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "How far in advance should I book your services?",
                answer:
                  "We recommend booking our full planning services 12-18 months in advance, partial planning 6-12 months in advance, and day-of coordination at least 3-6 months before your wedding date. However, we do occasionally have last-minute availability, so don't hesitate to reach out regardless of your timeline.",
              },
              {
                question: "What is your pricing structure?",
                answer:
                  "Our pricing varies based on the specific services you need, the complexity of your wedding, and the time required. We offer packages starting at $1,500 for day-of coordination, $3,500 for partial planning, and $7,000 for full-service planning. We're happy to provide a custom quote after learning more about your specific needs.",
              },
              {
                question: "Do you travel for destination weddings?",
                answer:
                  "Yes! We love planning destination weddings. Travel fees apply and vary depending on the location. We'll provide a detailed quote including all travel expenses for your consideration.",
              },
              {
                question: "How many weddings do you take on each year?",
                answer:
                  "To ensure each couple receives the attention they deserve, we limit the number of weddings we take on each year. This allows us to provide the highest level of service to our clients. We recommend booking early to secure your date.",
              },
              {
                question: "What happens after I contact you?",
                answer:
                  "After you submit your inquiry, we'll reach out within 24-48 hours to schedule a complimentary consultation. During this meeting, we'll discuss your vision, answer your questions, and determine if we're a good fit for each other. If you decide to move forward, we'll create a custom proposal and contract for your review.",
              },
              {
                question: "Do you work with a team or solo?",
                answer:
                  "We have a team of experienced planners and assistants. Depending on the size and complexity of your wedding, we'll assign the appropriate number of team members to ensure everything runs smoothly. You'll always have a lead planner as your main point of contact throughout the planning process.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-background">
                <CardHeader>
                  <CardTitle className="text-xl">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

