"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageCircle, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Booking item type
interface BookingItem {
  id: number
  name: string
  type: "vendor" | "planner"
  category: string
  price: number
  image: string
  email: string
  phoneNumber: string
}

interface ContactVendorDialogProps {
  vendor: BookingItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactVendorDialog({ vendor, open, onOpenChange }: ContactVendorDialogProps) {
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState(`Regarding my booking with ${vendor.name}`)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle copy to clipboard
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${type} Copied`,
      description: `${text} has been copied to your clipboard.`,
    })
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${vendor.name}.`,
      })

      setMessage("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {vendor.type === "vendor" ? "Vendor" : "Planner"}</DialogTitle>
          <DialogDescription>Get in touch with {vendor.name} about your booking</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            {/* <TabsTrigger value="message">Send Message</TabsTrigger> */}
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          {/* <TabsContent value="message" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder={`Type your message to ${vendor.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>
          </TabsContent> */}

          <TabsContent value="contact" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(vendor.email, "Email")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm">{vendor.email}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  (window.location.href = `mailto:${vendor.email}?subject=${encodeURIComponent(subject)}`)
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Phone</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleCopy(vendor.phoneNumber, "Phone")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm">{vendor.phoneNumber}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => (window.location.href = `tel:${vendor.phoneNumber.replace(/[^0-9]/g, "")}`)}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          {/* <Button type="button" disabled={isSubmitting} onClick={handleSendMessage}>
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

