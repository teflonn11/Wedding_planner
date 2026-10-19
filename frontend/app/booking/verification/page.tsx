"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Clock, ArrowLeft } from "lucide-react"
import { bookingApi, coupleApi } from "@/lib/api"

const VerificationPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const params = new URLSearchParams(searchParams as Record<string, string>)
  
  const bookingId = params.get('id')
  const totalAmount = params.get('totalAmount')
  const cardId = params.get('cardId')

  const router = useRouter()
  const { toast } = useToast()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [otpToValidate, setOtpToValidate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Set up countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  // Format time left as MM:SS
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // If input is filled, move to next input
    if (value && index < otp.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down (for backspace navigation)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const fetchOtp = async () => {
    const response = await coupleApi.getOtp()
    setOtpToValidate(response.data.otp)
  }

  // Handle OTP verification
  const verifyOtp = async () => {
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter all 6 digits of the OTP.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      
      if (otpValue === otpToValidate) {
        toast({
          title: "Verification successful",
          description: "Your payment has been processed successfully.",
        })

       const paymentData = {
          "bookingId": bookingId, 
          "amount": totalAmount, 
          "paymentMethod": "Credit Card", 
          "cardDetails": cardId,
          "transactionId": crypto.randomUUID()
      }

      // console.log("paymentData", paymentData);

      const response = await bookingApi.createPayment(paymentData)
      // console.log("create payment response", response);
      
      if(response.success && response?.data?.data) {

        // Redirect to booking details page
          router.push(`/booking/details?id=${bookingId}`)
        } else {
          toast({
            title: "Payment failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive",
          })
          router.push(`/booking/confirmation?id=${bookingId}`)
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "There was an error verifying your OTP. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const resendOtp = async () => {
    if (timeLeft > 0) return

    setIsResending(true)

    try {
      // Simulate API call to resend OTP
      fetchOtp();

      toast({
        title: "OTP resent",
        description: "A new OTP has been sent to your registered email.",
      })

      // Reset timer and OTP input
      setTimeLeft(60)
      setOtp(Array(6).fill(""))
      inputRefs.current[0]?.focus()
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "There was an error sending a new OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  // Set focus to first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
    if(!otpToValidate) {
      fetchOtp();
    }
  }, [otpToValidate])

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/booking/confirmation")}
          className="mb-8 p-0 flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to booking summary
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verify Payment</CardTitle>
            <CardDescription>Enter the 6-digit code sent to your registered email</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Verifying your payment...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-12 h-12 text-center text-lg"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Resend in {formatTimeLeft()}</span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    disabled={timeLeft > 0 || isResending}
                    onClick={resendOtp}
                    className="px-0 h-auto"
                  >
                    {isResending ? "Sending..." : "Resend OTP"}
                  </Button>
                </div>

                {/* <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Demo note:</span> For testing purposes, use
                    <span className="font-bold"> 123456</span> as the OTP.
                  </p>
                </div> */}
              </>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full" onClick={verifyOtp} disabled={isLoading || otp.some((digit) => digit === "")}>
              Verify and Complete Payment
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By completing this payment, you agree to our Terms and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default VerificationPage

