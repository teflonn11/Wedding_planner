import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname

  // Check if the path is for vendor-specific routes
  if (path.startsWith("/vendor/")) {
    // In a real app, you would check a JWT token or session cookie
    // For this demo, we'll check localStorage in the client components instead

    // For now, just allow the request to continue
    return NextResponse.next()
  }

  // Check if the path is for planner-specific routes
  if (path.startsWith("/planner/")) {
    // In a real app, you would check a JWT token or session cookie
    // For this demo, we'll check localStorage in the client components instead

    // For now, just allow the request to continue
    return NextResponse.next()
  }

  // Allow all other requests to continue
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/vendor/:path*", "/planner/:path*"],
}

