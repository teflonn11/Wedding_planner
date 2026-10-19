const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Types
export interface ApiResponse {
  success: boolean
  data?: any
  message?: string
}

// Get auth token from localStorage
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Set auth token in localStorage
export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

// Remove auth token from localStorage
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

// Get user data from localStorage
export const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user_data")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Set user data in localStorage
export const setUserData = (userData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_data", JSON.stringify(userData))
  }
}

// Remove user data from localStorage
export const removeUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data")
  }
}

// Check if user is authenticated
export const isAuthenticated = () => !!getToken() && !!getUserData()

// Generic API request function with authentication
export const apiRequest = async (endpoint, method = "GET", data = null, requiresAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`

  const headers = {
    "Content-Type": "application/json",
  }

  // Add auth token to headers if required and available
  if (requiresAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const options = {
    method,
    headers,
  }

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()

    if (response.status === 500 || response.status === 404) {
      return {
        success: false,
        message: result.error || "An error occurred",
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("API request error:", error)
    return {
      success: false,
      message: "Network error. Please try again.",
    }
  }
}

// Auth-specific API functions
export const authApi = {
  login: async (email, password) => {
    const response = await apiRequest("/auth/login", "POST", { email, password }, false)

    if (response.success && response.data) {
      // Store token
      if (response.data.token) {
        setToken(response.data.token)
      }

      // Store user data
      if (response.data.user) {
        setUserData(response.data.user)
      }
    }

    return response
  },

  register: async (userData) => {
    const response = await apiRequest("/auth/register", "POST", userData, false)

    if (response.success && response.data) {
      // Store token
      if (response.data.token) {
        setToken(response.data.token)
      }

      // Store user data
      if (response.data.user) {
        setUserData(response.data.user)
      }
    }

    return response
  },

  logout: () => {
    removeToken()
    removeUserData()
  },

  forgotPassword: async (email) => {
    const response = await apiRequest("/auth/forgot-password", "POST", { email }, false)
    return response
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiRequest("/auth/reset-password", "POST", { token, newPassword }, false)
    return response
  },
}

export const coupleApi = {
  createCouple: async (coupleData) => {
    const response = await apiRequest("/couples/profile", "POST", coupleData, true)
    return response
  },
  getCoupleDetails: async () => {
    const response = await apiRequest("/couples/profile", "GET", null, true)
    return response
  },
  updateCouple: async (coupleData) => {
    const response = await apiRequest("/couples/profile", "PATCH", coupleData, true)
    return response
  },
  getOtp: async () => {
    const response = await apiRequest(`/couples/sendOTP`, "GET", null, true)
    return response
  },
  sendRsvpEmail: async (rsvpData) => {
    const response = await apiRequest("/couples/sendRsvpEmail", "POST", rsvpData, true)
    return response
  },
}

export const vendorApi = {
  createVendor: async (vendorData) => {
    const response = await apiRequest("/vendors/profile", "POST", vendorData, true)
    return response
  },
  getVendorDetails: async () => {
    const response = await apiRequest("/vendors/profile", "GET", null, true)
    return response
  },
  updateVendor: async (vendorData) => {
    const response = await apiRequest("/vendors/profile", "PATCH", vendorData, true)
    return response
  },
  getVendors: async () => {
    const response = await apiRequest("/vendors", "GET", null, true)
    return response
  },
  getVendorById: async (vendorId: string) => {
    const response = await apiRequest(`/vendors/${vendorId}`, "GET", null, true)
    return response
  },
}
export const plannerApi = {
  createPlanner: async (plannerData) => {
    const response = await apiRequest("/planners/profile", "POST", plannerData, true)
    return response
  },
  getPlannerDetails: async () => {
    const response = await apiRequest("/planners/profile", "GET", null, true)
    return response
  },
  updatePlanner: async (plannerData) => {
    const response = await apiRequest("/planners/profile", "PATCH", plannerData, true)
    return response
  },
  getPlanners: async () => {
    const response = await apiRequest("/planners", "GET", null, true)
    return response
  },
  getPlannerById: async (plannerId: string) => {
    const response = await apiRequest(`/planners/${plannerId}`, "GET", null, true)
    return response
  },
}

export const utilityApi = {
  getCategories: async () => {
    const response = await apiRequest("/utilities/categories", "GET", null, true)
    return response
  },
  getServices: async (categoryId?: string) => {
    const response = await apiRequest(`/utilities/services${categoryId ? `?cId=${categoryId}` : ""}`, "GET", null, true)
    return response
  },
  // updatePlanner: async (plannerData) => {
  //   const response = await apiRequest("/planners", "PUT", plannerData, true)
  //   return response
  // },
}

export const bookingApi = {
  createBooking: async (bookingData) => {
    const response = await apiRequest("/bookings", "POST", bookingData, true)
    return response
  },
  getBookingDetails: async (bookingId: string) => {
    const response = await apiRequest(`/bookings/${bookingId}`, "GET", null, true)
    return response
  },
  createPayment: async (paymentData) => {
    const response = await apiRequest("/payments", "POST", paymentData, true)
    return response
  },
  getBookings: async () => {
    const response = await apiRequest("/bookings", "GET", null, true)
    return response
  },
  cancelBooking: async (bookingId: string) => {
    const response = await apiRequest(`/bookings/${bookingId}`, "DELETE", null, true)
    return response
  },
  completeBooking: async (bookingId: string) => {
    const response = await apiRequest(`/bookings/complete/${bookingId}`, "POST", null, true)
    return response
  },
}

export const usersApi = {
  changePassword: async (passwordData) => {
    const response = await apiRequest("/users/change-password", "POST", passwordData, true)
    return response
  },
  contactUs: async (contactData) => {
    const response = await apiRequest("/users/contactus", "POST", contactData, false)
    return response
  },
  sendRsvp: async (rsvpData) => {
    const response = await apiRequest("/users/rsvp", "POST", rsvpData, false)
    return response
  },
  getReviewsByVendorId: async (vendorId: string) => {
    const response = await apiRequest(`/users/reviews/vendor/${vendorId}`, "GET", null, true)
    return response
  },
  getReviewsByPlannerId: async (plannerId: string) => {
    const response = await apiRequest(`/users/reviews/planner/${plannerId}`, "GET", null, true)
    return response
  },
  createReview: async (reviewData) => {
    const response = await apiRequest("/users/reviews", "POST", reviewData, true)
    return response
  },
}