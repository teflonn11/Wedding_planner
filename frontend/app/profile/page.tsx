"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { toast } = useToast()

  // Simulate checking if user is logged in and getting user type
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get user type from local storage or default to couple
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}")

        // Redirect to the appropriate profile page based on user type
        if (userData.roleId === 1) {
          router.push("/profile/couple")
        } else if (userData.roleId === 2) {
          router.push("/profile/vendor")
        } else if (userData.roleId === 3) {
          router.push("/profile/planner")
        }
      } catch (error) {
        console.error("Authentication error:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // This is just a fallback if redirection fails
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Selection</CardTitle>
            <CardDescription>Choose your profile type to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => {
                  router.push("/profile/couple")
                }}
              >
                Couple Profile
              </Button>
              <Button
                onClick={() => {
                  router.push("/profile/vendor")
                }}
              >
                Vendor Profile
              </Button>
              <Button
                onClick={() => {
                  router.push("/profile/planner")
                }}
              >
                Planner Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

