import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CheckCircle, Clock4, XCircle, CheckCheck } from "lucide-react"

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed"

interface BookingStatusBadgeProps {
  status: BookingStatus
  showIcon?: boolean
  className?: string
}

export function BookingStatusBadge({ status, showIcon = true, className }: BookingStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        status === "confirmed" && "bg-green-50 text-green-700 border-green-200",
        status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
        status === "cancelled" && "bg-red-50 text-red-700 border-red-200",
        status === "completed" && "bg-blue-50 text-blue-700 border-blue-200",
        className,
      )}
    >
      {showIcon && (
        <>
          {status === "confirmed" && <CheckCircle className="h-3.5 w-3.5 mr-1" />}
          {status === "pending" && <Clock4 className="h-3.5 w-3.5 mr-1" />}
          {status === "cancelled" && <XCircle className="h-3.5 w-3.5 mr-1" />}
          {status === "completed" && <CheckCheck className="h-3.5 w-3.5 mr-1" />}
        </>
      )}
      {status === "confirmed" && "Confirmed"}
      {status === "pending" && "Pending"}
      {status === "cancelled" && "Cancelled"}
      {status === "completed" && "Completed"}
    </Badge>
  )
}

