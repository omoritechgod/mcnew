"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Eye,
  Edit,
  Filter,
  Download,
} from "lucide-react"
import AdminLayout from "../../../components/admin/AdminLayout"
import { adminBookingApi, type Booking } from "../../../services/bookingApi"

interface AdminBooking extends Booking {
  // All properties are already defined in the Booking interface from bookingApi
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showStatusModal, setShowStatusModal] = useState<{ booking: AdminBooking | null; isOpen: boolean }>({
    booking: null,
    isOpen: false,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await adminBookingApi.getApartmentBookings()
      setBookings(response.data)
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={16} />, label: "Pending Review" },
      processing: { color: "bg-blue-100 text-blue-800", icon: <AlertCircle size={16} />, label: "Processing" },
      paid: { color: "bg-green-100 text-green-800", icon: <CreditCard size={16} />, label: "Paid" },
      checked_in: { color: "bg-purple-100 text-purple-800", icon: <CheckCircle size={16} />, label: "Checked In" },
      checked_out: { color: "bg-indigo-100 text-indigo-800", icon: <CheckCircle size={16} />, label: "Checked Out" },
      completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={16} />, label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle size={16} />, label: "Cancelled" },
      refunded: { color: "bg-gray-100 text-gray-800", icon: <DollarSign size={16} />, label: "Refunded" },
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await adminBookingApi.updateBookingStatus(bookingId, newStatus)

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as any, updated_at: new Date().toISOString() }
            : booking,
        ),
      )

      setShowStatusModal({ booking: null, isOpen: false })

      alert(`Booking #${bookingId} status updated to ${newStatus}. User will be notified.`)
    } catch (error) {
      console.error("Error updating booking status:", error)
      alert("Failed to update booking status")
    }
  }

  const handleReleasePayment = async (bookingId: number, amount: string) => {
    try {
      console.log("Releasing payment for booking", bookingId, "amount", amount)

      const totalAmount = Number.parseFloat(amount)
      const commission = totalAmount * 0.1
      const vendorPayout = totalAmount - commission

      const confirmed = window.confirm(
        `Release payment for Booking #${bookingId}?\n\n` +
          `Total Amount: ₦${totalAmount.toLocaleString()}\n` +
          `Commission (10%): ₦${commission.toLocaleString()}\n` +
          `Vendor Payout: ₦${vendorPayout.toLocaleString()}`,
      )

      if (confirmed) {
        await handleStatusUpdate(bookingId, "completed")
        alert("Payment released to vendor successfully!")
      }
    } catch (error) {
      console.error("Error releasing payment:", error)
      alert("Failed to release payment")
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
    const matchesSearch =
      searchTerm === "" ||
      booking.listing?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vendor?.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  const statusCounts = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
              <p className="text-gray-600">Manage all apartment bookings and payments</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                Advanced Filter
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{statusCounts.paid || 0}</div>
            <div className="text-sm text-gray-600">Paid Bookings</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              ₦{bookings.reduce((sum, b) => sum + Number.parseFloat(b.total_price), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by booking ID, guest name, property, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({bookings.length})
              </button>
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getStatusConfig(status).label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Booking</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Guest</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Property</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Dates</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status)

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-semibold text-gray-900">#{booking.id}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{booking.user.name}</div>
                          <div className="text-sm text-gray-600">{booking.user.email}</div>
                          {booking.user.phone && <div className="text-sm text-gray-600">{booking.user.phone}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.listing?.images[0] || "/placeholder.svg"}
                            alt={booking.listing?.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{booking.listing?.title}</div>
                            <div className="text-sm text-gray-600">{booking.listing?.location}</div>
                            <div className="text-sm text-gray-600">{booking.vendor?.business_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(booking.check_in_date).toLocaleDateString()} -
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-600">
                            {booking.nights} night{booking.nights > 1 ? "s" : ""} • {booking.guests} guest
                            {booking.guests > 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          ₦{Number.parseFloat(booking.total_price).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowStatusModal({ booking, isOpen: true })}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Update Status"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          {booking.status === "checked_out" && (
                            <button
                              onClick={() => handleReleasePayment(booking.id, booking.total_price)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Release Payment"
                            >
                              <DollarSign size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {selectedStatus === "all"
                  ? "No bookings have been made yet."
                  : `No ${getStatusConfig(selectedStatus).label.toLowerCase()} bookings found.`}
              </p>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {showStatusModal.isOpen && showStatusModal.booking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Booking Status</h3>
              <p className="text-gray-600 mb-6">
                Booking #{showStatusModal.booking.id} - {showStatusModal.booking.listing?.title}
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "pending",
                  "processing",
                  "paid",
                  "checked_in",
                  "checked_out",
                  "completed",
                  "cancelled",
                  "refunded",
                ].map((status) => {
                  const config = getStatusConfig(status)
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(showStatusModal.booking!.id, status)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        showStatusModal.booking!.status === status
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {config.icon}
                      <span className="font-medium">{config.label}</span>
                      {showStatusModal.booking!.status === status && (
                        <span className="ml-auto text-blue-600 text-sm">Current</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal({ booking: null, isOpen: false })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default BookingManagement
