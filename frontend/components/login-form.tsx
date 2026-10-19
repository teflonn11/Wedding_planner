"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"

// Add the Eye and EyeOff icons import
import { Eye, EyeOff } from "lucide-react"

export default function LoginForm({
  onSuccess,
  onForgotPassword,
}: {
  onSuccess: (userData: { name: string; email: string; roleId: string | number }) => void
  onForgotPassword: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()

  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call login API
      const response = await authApi.login(formData.email, formData.password)

      if (response.success && response.data && response.data.user) {
        const userData = response.data.user

        // Get user name from response
        const userName =
          userData.name ||
          (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email)

        // Get roleId from response
        const roleId = userData.roleId || userData.role_id

        toast({
          title: "Login successful",
          description: `Welcome back, ${userName}!`,
        })

        onSuccess({
          name: userName,
          email: userData.email,
          roleId: roleId,
        })
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Invalid email or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* Update the password input field to include the toggle button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" className="px-0 font-normal h-auto text-xs" type="button" onClick={onForgotPassword}>
            Forgot password?
          </Button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}

