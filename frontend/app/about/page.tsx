import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Award, Clock, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 z-5"></div>
        </div>
        <div className="container relative z-20 flex h-full flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">About Us</h1>
            <p className="mt-6 max-w-lg mx-auto text-lg text-white/90 md:text-xl">
              Meet the team behind your perfect wedding day
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Story</h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  The Dream Wedding Co. was founded in 2010 by a team of passionate event planners who saw a need for
                  personalized, stress-free wedding planning services.
                </p>
                <p>
                  What started as a small team of three has grown into a full-service wedding planning company with a
                  reputation for excellence, creativity, and attention to detail.
                </p>
                <p>
                  Over the years, we've had the privilege of planning hundreds of weddings, each one unique and special.
                  We've worked with couples from all walks of life, helping them bring their wedding dreams to life.
                </p>
                <p>
                  Our mission is simple: to make your wedding day everything you've ever dreamed of and more, while
                  ensuring the planning process is enjoyable and stress-free.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">300+</div>
                    <div className="text-sm text-muted-foreground">Weddings Planned</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">98%</div>
                    <div className="text-sm text-muted-foreground">Happy Couples</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">13</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20">
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <div className="text-center">
                  <div className="text-6xl font-serif">TWC</div>
                  <div className="mt-2 text-lg">The Dream Wedding Co.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Team</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The passionate professionals dedicated to making your wedding dreams come true
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Emily Johnson",
                role: "Founder & Lead Planner",
                bio: "With over 15 years of experience in event planning, Emily brings creativity and precision to every wedding.",
              },
              {
                name: "Michael Chen",
                role: "Design Director",
                bio: "Michael's eye for design and detail ensures that every wedding is visually stunning and unique.",
              },
              {
                name: "Sophia Rodriguez",
                role: "Vendor Coordinator",
                bio: "Sophia's extensive network of vendors and negotiation skills ensure you get the best services for your budget.",
              },
              {
                name: "James Wilson",
                role: "Day-of Coordinator",
                bio: "James' calm demeanor and problem-solving abilities make him the perfect person to oversee your wedding day.",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg bg-background shadow-md transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-square relative overflow-hidden bg-secondary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-serif text-primary">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">The principles that guide everything we do</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Personalization",
                description:
                  "We believe every wedding should be as unique as the couple. We take the time to understand your vision and bring it to life.",
                icon: <Heart className="h-10 w-10 text-primary" />,
              },
              {
                title: "Attention to Detail",
                description:
                  "From the big picture to the smallest details, we ensure everything is perfect for your special day.",
                icon: <Award className="h-10 w-10 text-primary" />,
              },
              {
                title: "Stress-Free Experience",
                description:
                  "We handle the logistics and challenges so you can focus on enjoying your engagement and wedding day.",
                icon: <Users className="h-10 w-10 text-primary" />,
              },
            ].map((value, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Planning?</h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            Let's create the wedding of your dreams together. Contact us today to schedule a consultation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

