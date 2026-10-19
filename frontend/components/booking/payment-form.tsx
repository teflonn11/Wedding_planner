"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Calendar, Lock, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PaymentFormProps = {
  onSubmit: (data: any) => void
  loading: boolean
  totalAmount: number
}

export function PaymentForm({ onSubmit, loading, totalAmount }: PaymentFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? "/" + v.slice(2, 4) : "")
    }

    return v
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format the value based on field type
    let formattedValue = value
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (name === "cvv") {
      formattedValue = value.replace(/[^0-9]/g, "").slice(0, 3)
    }

    setFormData({ ...formData, [name]: formattedValue })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Card number validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    // Expiry date validation
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^\d\d\/\d\d$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)"
    } else {
      // Check if date is in the future
      const [month, year] = formData.expiryDate.split("/")
      const now = new Date()
      const currentMonth = now.getMonth() + 1 // 1-12
      const currentYear = now.getFullYear() % 100 // 0-99

      const expiryMonth = Number.parseInt(month, 10)
      const expiryYear = Number.parseInt(year, 10)

      if (expiryMonth < 1 || expiryMonth > 12) {
        newErrors.expiryDate = "Invalid month"
      } else if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiryDate = "Card has expired"
      }
    }

    // CVV validation
    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // For demo purposes, use test card number
      // if (formData.cardNumber.replace(/\s/g, "") !== "4242424242424242") {
      //   toast({
      //     title: "Demo Mode",
      //     description: "Please use test card number 4242 4242 4242 4242",
      //     variant: "destructive",
      //   })
      //   return
      // }

      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          Card Number
        </Label>
        <div className="relative">
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="4242 4242 4242 4242"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
            className={errors.cardNumber ? "border-destructive" : ""}
            disabled={loading}
          />
          {errors.cardNumber && (
            <div className="absolute -bottom-5 left-0 text-destructive text-xs flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.cardNumber}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <div className="relative">
          <Input
            id="cardholderName"
            name="cardholderName"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={handleChange}
            className={errors.cardholderName ? "border-destructive" : ""}
            disabled={loading}
          />
          {errors.cardholderName && (
            <div className="absolute -bottom-5 left-0 text-destructive text-xs flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.cardholderName}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Expiry Date
          </Label>
          <div className="relative">
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength={5}
              className={errors.expiryDate ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.expiryDate && (
              <div className="absolute -bottom-5 left-0 text-destructive text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.expiryDate}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            CVV
          </Label>
          <div className="relative">
            <Input
              id="cvv"
              name="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={3}
              className={errors.cvv ? "border-destructive" : ""}
              disabled={loading}
            />
            {errors.cvv && (
              <div className="absolute -bottom-5 left-0 text-destructive text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.cvv}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <div className="bg-yellow-50 border border-yellow-100 rounded-md p-2 text-xs text-yellow-800 mt-6">
        <p className="font-medium">Demo Mode</p>
        <p>Use test card number: 4242 4242 4242 4242</p>
        <p>Any future expiry date and any 3-digit CVV will work.</p>
      </div> */}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : `Pay £${totalAmount.toLocaleString()}`}
      </Button>
    </form>
  )
}

