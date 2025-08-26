"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  User,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardList,
} from "lucide-react"

import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import { serviceOrderApi, type ServiceOrder } from "../../../services/serviceOrderApi"

const MyServiceOrders: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<"all" | "pending" | "active" | "completed">("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceOrderApi.getUserOrders()
      setOrders(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setError("Failed to fetch your service orders")
      console.error("Error fetching orders:", err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    try {
      await serviceOrderApi.cancelOrder(orderId)
      await fetchOrders()
      alert("Order cancelled successfully!")
    } catch (error) {
      console.error("Error cancelling order:", error)
      alert("Failed to cancel order. Please try again.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-yellow-600" />
      case "accepted":
        return <CheckCircle size={16} className="text-blue-600" />
      case "in_progress":
        return <AlertCircle size={16} className="text-orange-600" />
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />
      default:
        return <Clock size={16} className="text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    switch (selectedTab) {
      case "pending":
        return order.status === "pending"
      case "active":
        return ["accepted", "in_progress"].includes(order.status)
      case "completed":
        return ["completed", "cancelled"].includes(order.status)
      default:
        return true
    }
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your service orders...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={24} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Service Orders</h1>
              <p className="text-gray-600">Track and manage all your booked services</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: "all", name: "All Orders", count: orders.length },
              { id: "pending", name: "Pending", count: orders.filter((o) => o.status === "pending").length },
              {
                id: "active",
                name: "Active",
                count: orders.filter((o) => ["accepted", "in_progress"].includes(o.status)).length,
              },
              {
                id: "completed",
                name: "Completed",
                count: orders.filter((o) => ["completed", "cancelled"].includes(o.status)).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      selectedTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedTab === "all" ? "No service orders yet" : `No ${selectedTab} orders`}
              </h3>
              <p className="text-gray-600">
                {selectedTab === "all"
                  ? "When you book services, your orders will appear here."
                  : `You don't have any ${selectedTab} service orders at the moment.`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.service_pricing?.title || "Service Order"}
                      </h3>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{order.service_vendor?.vendor?.business_name || "Service Vendor"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>{order.service_vendor?.vendor?.user?.phone || "Phone not available"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Deadline: {new Date(order.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">₦{order.total_amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Order #{order.id}</div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Requirements:</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.requirements}</p>
                </div>

                {/* Vendor Response */}
                {order.vendor_response && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-blue-400" />
                      <span className="text-sm font-medium text-blue-700">Vendor Response:</span>
                    </div>
                    <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3">{order.vendor_response}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {order.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {/* Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div>Placed: {new Date(order.created_at).toLocaleString()}</div>
                  <div>Last Updated: {new Date(order.updated_at).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyServiceOrders
