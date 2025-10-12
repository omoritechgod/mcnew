"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ExternalLink,
} from "lucide-react"
import { bookingApi } from "../../../services/bookingApi"

interface Booking {
  id: number
  listing_id: number
  vendor_id: number
  check_in_date: string
  check_out_date: string
  nights: number
  guests: number
  total_price: string
  status: "pending" | "processing" | "paid" | "checked_in" | "checked_out" | "completed" | "cancelled" | "refunded"
  notes?: string
  created_at: string
  updated_at: string
  // Relationships
  listing: {
    id: number
    title: string
    location: string
    images: string[]
    type: string
  }
  vendor: {
    id: number
    business_name: string
    contact_phone?: string
  }
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await bookingApi.getMyBookings()
        setBookings(response.data)
      } catch (err) {
        setError("Failed to fetch bookings")
        console.error("Error fetching bookings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock size={16} />,
        label: "Pending Review",
        description: "Waiting for admin approval",
      },
      processing: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <AlertCircle size={16} />,
        label: "Approved - Payment Required",
        description: "Ready for payment",
      },
      paid: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CreditCard size={16} />,
        label: "Paid",
        description: "Payment confirmed, ready for check-in",
      },
      checked_in: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <CheckCircle size={16} />,
        label: "Checked In",
        description: "Currently staying",
      },
      checked_out: {
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
        icon: <CheckCircle size={16} />,
        label: "Checked Out",
        description: "Stay completed, processing payment",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle size={16} />,
        label: "Completed",
        description: "Booking successfully completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle size={16} />,
        label: "Cancelled",
        description: "Booking was cancelled",
      },
      refunded: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <RefreshCw size={16} />,
        label: "Refunded",
        description: "Payment has been refunded",
      },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const handlePayment = async (bookingId: number, amount: string) => {
    try {
      const response = await bookingApi.initiatePayment({
        booking_id: bookingId,
        payment_method: "paystack",
      })

      // Redirect to Flutterwave payment page
      if (response.data.link) {
        window.location.href = response.data.link
      } else {
        alert("Payment link not available. Please try again.")
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      alert("Failed to initiate payment. Please try again.")
    }
  }

  const handleCheckIn = async (bookingId: number) => {
    try {
      await bookingApi.checkIn(bookingId)

      // Update local state
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "checked_in" as any } : booking)),
      )

      alert("Successfully checked in!")
    } catch (error) {
      console.error("Check-in error:", error)
      alert("Failed to check in. Please try again.")
    }
  }

  const handleCheckOut = async (bookingId: number) => {
    try {
      await bookingApi.checkOut(bookingId)

      // Update local state
      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? { ...booking, status: "checked_out" as any } : booking)),
      )

      alert("Successfully checked out!")
    } catch (error) {
      console.error("Check-out error:", error)
      alert("Failed to check out. Please try again.")
    }
  }

  const filteredBookings =
    selectedStatus === "all" ? bookings : bookings.filter((booking) => booking.status === selectedStatus)

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track and manage your apartment bookings</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({bookings.length})
            </button>
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {getStatusConfig(status).label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status)

            return (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  {/* Booking Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <img
                        src={booking.listing.images[0] || "/placeholder.svg"}
                        alt={booking.listing.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{booking.listing.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin size={14} />
                          <span>{booking.listing.location}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Booking #{booking.id} • {booking.vendor.business_name}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mt-2">
                        ₦{Number.parseFloat(booking.total_price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Check-in</div>
                        <div className="text-sm text-gray-600">
                          {new Date(booking.check_in_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">Check-out</div>
                        <div className="text-sm text-gray-600">
                          {new Date(booking.check_out_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">
                          {booking.nights} night{booking.nights > 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-gray-600">
                          {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Notes */}
                  {booking.notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={16} className="text-blue-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-blue-900">Special Requests</div>
                          <div className="text-sm text-blue-800">{booking.notes}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Description */}
                  <div className="mb-4 text-sm text-gray-600">{statusConfig.description}</div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {booking.status === "processing" && (
                      <button
                        onClick={() => handlePayment(booking.id, booking.total_price)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CreditCard size={16} />
                        Pay Now
                      </button>
                    )}

                    {booking.status === "paid" && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Check In
                      </button>
                    )}

                    {booking.status === "checked_in" && (
                      <button
                        onClick={() => handleCheckOut(booking.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Check Out
                      </button>
                    )}

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink size={16} />
                      View Details
                    </button>

                    {booking.vendor.contact_phone && (
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare size={16} />
                        Contact Host
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedStatus === "all"
                ? "No bookings yet"
                : `No ${getStatusConfig(selectedStatus).label.toLowerCase()} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === "all"
                ? "Start exploring our amazing apartments and make your first booking!"
                : "Try selecting a different status filter to see other bookings."}
            </p>
            <button
              onClick={() => (window.location.href = "/service-apartments")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Apartments
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyBookings
