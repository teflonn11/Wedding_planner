"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setVerificationStatus("error")
        return
      }

      try {
        // This would be replaced with actual verification logic
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // For demo purposes, we'll just check if the token exists
        if (token) {
          setVerificationStatus("success")
        } else {
          setVerificationStatus("error")
        }
      } catch (error) {
        setVerificationStatus("error")
      }
    }

    verifyAccount()
  }, [token])

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle>Account Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
          {verificationStatus === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-center text-muted-foreground">Please wait while we verify your account...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Verification Successful!</h3>
                <p className="text-muted-foreground">
                  Your account has been successfully verified. You can now log in to access your account.
                </p>
              </div>
              <Button onClick={() => router.push("/")} className="mt-4">
                Go to Login
              </Button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <XCircle className="h-16 w-16 text-destructive" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Verification Failed</h3>
                <p className="text-muted-foreground">
                  We couldn't verify your account. The verification link may be invalid or expired.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full mt-4">
                <Button onClick={() => router.push("/")} variant="outline">
                  Return to Home
                </Button>
                <Button onClick={() => router.push("/contact")}>Contact Support</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

