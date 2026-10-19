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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, Send } from "lucide-react"

interface Client {
  id: number
  name: string
  email: string
  phone: string
  image?: string
}

interface ContactClientDialogProps {
  client: Client
  booking: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactClientDialog({ client, booking, open, onOpenChange }: ContactClientDialogProps) {
  const { toast } = useToast()
  const [subject, setSubject] = useState(`Regarding your booking ${booking.id}`)
  const [message, setMessage] = useState("")
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${client.name}.`,
      })

      // Reset form and close dialog
      setMessage("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {client.name}</DialogTitle>
          <DialogDescription>Send a message to the client regarding their booking.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
              <img
                src={client.image || "/placeholder.svg?height=48&width=48"}
                alt={client.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{client.name}</p>
              <div className="flex flex-col text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {client.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={contactMethod === "email" ? "default" : "outline"}
              onClick={() => setContactMethod("email")}
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              type="button"
              variant={contactMethod === "phone" ? "default" : "outline"}
              onClick={() => setContactMethod("phone")}
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              Phone
            </Button>
          </div>

          {contactMethod === "email" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
            </>
          )}

          {contactMethod === "phone" && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium mb-1">Call Client</p>
                <p className="text-sm text-muted-foreground mb-3">You can call the client directly at:</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // In a real app, this might use a click-to-call service
                    window.location.href = `tel:${client.phone}`
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {client.phone}
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Call Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about your call here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {contactMethod === "email" ? "Send Email" : "Save Notes"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

