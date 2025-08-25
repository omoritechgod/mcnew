// src/components/dashboard/VendorDashboard.tsx
import React, { useEffect, useState } from "react"
import { DollarSign, Package, Users, Star, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "./DashboardLayout"   // ✅ import the layout wrapper

interface Order {
  id: string
  customer: string
  service: string
  amount: string
  status: "completed" | "in-progress" | "pending"
  date: string
}

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "₦0", change: "+0%", icon: <DollarSign size={24} className="text-green-600" /> },
    { title: "Active Listings", value: "0", change: "0", icon: <Package size={24} className="text-blue-600" /> },
    { title: "Total Orders", value: "0", change: "+0%", icon: <Users size={24} className="text-purple-600" /> },
    { title: "Rating", value: "0.0", change: "0", icon: <Star size={24} className="text-yellow-600" /> }
  ])

  const [recentOrders, setRecentOrders] = useState<Order[]>([
    {
      id: "#ORD-001",
      customer: "John Doe",
      service: "House Cleaning",
      amount: "₦15,000",
      status: "completed",
      date: "2024-01-15"
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      service: "Electrical Repair",
      amount: "₦8,500",
      status: "in-progress",
      date: "2024-01-14"
    },
    {
      id: "#ORD-003",
      customer: "Mike Johnson",
      service: "Plumbing Service",
      amount: "₦12,000",
      status: "pending",
      date: "2024-01-13"
    }
  ])

  useEffect(() => {
    // Later replace with backend fetch
    // api.get("/vendor/dashboard").then((res) => {
    //   setStats(res.data.stats)
    //   setRecentOrders(res.data.orders)
    // })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-50 rounded-full p-3">{stat.icon}</div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button
                onClick={() => navigate("/dashboard/service-vendor/orders")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div>
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {order.customer} • {order.service}
                    </div>
                    <div className="text-xs text-gray-500">{order.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{order.amount}</div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
            <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart will be implemented with backend data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default VendorDashboard
