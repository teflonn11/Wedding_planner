"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"
import ForgotPasswordForm from "./forgot-password-form"
import { authApi, isAuthenticated, apiRequest, getUserData, usersApi } from "@/lib/api"

export default function AuthButtons() {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        // Get user data from localStorage
        const userData = getUserData()
        if (userData) {
          setUser(userData)
          setIsLoggedIn(true)
        }
      }
    }

    checkAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    setOpen(false)
  }

  const handleLogout = () => {
    // Clear auth token and user data
    authApi.logout()

    // Reset state
    setUser(null)
    setIsLoggedIn(false)

    // Redirect to home
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    // Validation
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive",
      })
      return
    }

    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      })
      return
    }

    try {
      // Call API to update password
      const response = await usersApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      })

      if (response.success) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated",
        })

        setPasswordModalOpen(false)
        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Password update error:", error)
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleForgotPassword = () => {
    setForgotPasswordMode(true)
  }

  const handleBackToLogin = () => {
    setForgotPasswordMode(false)
  }

  // Get profile route based on roleId
  const getProfileRoute = (roleId) => {
    if (roleId === "1" || roleId === 1) {
      return "/profile/couple"
    } else if (roleId === "2" || roleId === 2) {
      return "/profile/vendor"
    } else if (roleId === "3" || roleId === 3) {
      return "/profile/planner"
    } else {
      return "/profile" // Fallback
    }
  }

  // Get bookings route based on roleId
  const getBookingsRoute = (roleId) => {
    if (roleId === "2" || roleId === 2) {
      return "/vendor/bookings"
    } else if (roleId === "3" || roleId === 3) {
      return "/planner/bookings"
    } else {
      return "/bookings" // Default for couples and fallback
    }
  }

  // If logged in, show user avatar and dropdown
  if (isLoggedIn && user) {
    const userName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    const initials = userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

    const roleId = user.roleId || user.role_id
    const isCouple = roleId === "1" || roleId === 1

    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                {initials}
              </div>
              <span className="hidden md:inline-block max-w-[100px] truncate">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push(getProfileRoute(roleId))}>View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(getBookingsRoute(roleId))}>View Bookings</DropdownMenuItem>
            {isCouple && <DropdownMenuItem onClick={() => router.push("/vendors")}>View Vendors</DropdownMenuItem>}
            {isCouple && <DropdownMenuItem onClick={() => router.push("/planners")}>View Planners</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => setPasswordModalOpen(true)}>Update Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Password Update Modal */}
        <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>Enter your current password and a new password below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordUpdate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Default login/signup dialog
  return (
    <div className="flex items-center gap-2">
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
          if (!newOpen) {
            // Reset forgot password mode when dialog is closed
            setForgotPasswordMode(false)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Login / Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {forgotPasswordMode ? (
            <>
              <DialogHeader>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogDescription>Enter your email to receive a password reset link.</DialogDescription>
              </DialogHeader>
              <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Welcome</DialogTitle>
                <DialogDescription>Login or create an account to get started</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onSuccess={(userData) => handleLogin(userData)} onForgotPassword={handleForgotPassword} />
                </TabsContent>
                <TabsContent value="signup">
                  <SignupForm onSuccess={(userData) => handleLogin(userData)} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

