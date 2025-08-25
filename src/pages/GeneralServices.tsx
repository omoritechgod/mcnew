// src/pages/GeneralServices.tsx
"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, Search, MapPin, Shield, Phone, MessageCircle, Filter, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { serviceVendorApi, type ServiceVendor } from "../services/serviceVendorApi"
import ServiceBookingModal, { type ServiceOrderData } from "../components/services/ServiceBookingModal"
import { serviceOrderApi } from "../services/serviceOrderApi"

// Define service categories for frontend categorization
const SERVICE_CATEGORIES = [
  { id: "all", name: "All Services", icon: "🔧" },
  { id: "plumbing", name: "Plumbing", icon: "🚿" },
  { id: "electrical", name: "Electrical", icon: "⚡" },
  { id: "cleaning", name: "Cleaning", icon: "🧹" },
  { id: "repair", name: "Repair & Maintenance", icon: "🔨" },
  { id: "installation", name: "Installation", icon: "🔧" },
  { id: "other", name: "Other Services", icon: "⚙️" },
]

const GeneralServices: React.FC = () => {
  const navigate = useNavigate()
  const [vendors, setVendors] = useState<ServiceVendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<ServiceVendor | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchServiceVendors()
  }, [])

  const fetchServiceVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceVendorApi.getPublicVendors()

      if (response.data && Array.isArray(response.data)) {
        const vendorsWithCategories = response.data.map((vendor) => ({
          ...vendor,
          category: categorizeVendor(vendor),
        }))
        setVendors(vendorsWithCategories)
      } else {
        setVendors([])
      }
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setError("Failed to fetch service vendors. Please try again.")
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  // Categorize vendor based on keywords
  const categorizeVendor = (vendor: ServiceVendor): string => {
    const searchText =
      `${vendor.service_name} ${vendor.description} ${vendor.pricings.map((p) => `${p.title}`).join(" ")}`.toLowerCase()

    if (searchText.includes("plumb") || searchText.includes("pipe") || searchText.includes("tap") || searchText.includes("water")) {
      return "plumbing"
    }
    if (searchText.includes("electric") || searchText.includes("wiring") || searchText.includes("socket") || searchText.includes("light")) {
      return "electrical"
    }
    if (searchText.includes("clean") || searchText.includes("wash") || searchText.includes("sweep")) {
      return "cleaning"
    }
    if (searchText.includes("repair") || searchText.includes("fix") || searchText.includes("maintain")) {
      return "repair"
    }
    if (searchText.includes("install") || searchText.includes("setup") || searchText.includes("mount")) {
      return "installation"
    }
    return "other"
  }

  const handleBookService = (vendor: ServiceVendor) => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login to book a service")
      navigate("/login")
      return
    }

    setSelectedVendor(vendor)
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async (orderData: ServiceOrderData) => {
    try {
      setBookingLoading(true)
      await serviceOrderApi.createOrder(orderData)

      setShowBookingModal(false)
      setSelectedVendor(null)

      alert("Service request sent successfully! The vendor will respond shortly.")
      navigate("/dashboard/user")
    } catch (error) {
      console.error("Error creating service order:", error)
      alert("Failed to send service request. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  // Filter vendors by search & category
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.pricings.some((pricing) => pricing.title.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Display phone number
  const getDisplayPhone = (vendor: ServiceVendor): string | null => {
    return vendor.phone || vendor.vendor.user?.phone || null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">General Services</h1>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for services, providers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <Shield size={16} />
              <span>{error}</span>
            </div>
            <button onClick={fetchServiceVendors} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
              Try Again
            </button>
          </div>
        )}

        {/* Vendors List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Available Service Providers</h2>

          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredVendors.map((vendor) => {
                const displayPhone = getDisplayPhone(vendor)
                return (
                <div key={vendor.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Profile Picture */}
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${vendor.vendor.user.profile_picture}`}
                      alt={vendor.vendor.user.name}
                      className="w-16 h-16 rounded-full object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.png"
                      }}
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{vendor.service_name}</h3>
                        {vendor.vendor.is_verified === 1 && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Shield size={12} />
                            Verified
                          </div>
                        )}
                      </div>

                      {/* Vendor personal + business name */}
                      <p className="text-sm font-medium text-gray-700">
                        {vendor.vendor.user.name} — {vendor.vendor.business_name}
                      </p>

                      <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin size={14} />
                        <span className="capitalize">{vendor.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star size={14} />
                          <span>{vendor.rating}</span>
                          <span className="text-gray-500">({vendor.total_reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Available Services:</h4>
                    <div className="space-y-2">
                      {vendor.pricings.slice(0, 3).map((pricing) => (
                        <div key={pricing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-900">{pricing.title}</div>
                          <div className="text-lg font-bold text-blue-600 ml-4">
                            ₦{Number(pricing.price).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBookService(vendor)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Book Service
                    </button>
                  </div>
                </div>

                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No service providers found.
            </div>
          )}
        </div>
      </div>

      {/* Service Booking Modal */}
      {showBookingModal && selectedVendor && (
        <ServiceBookingModal
          vendor={selectedVendor}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedVendor(null)
          }}
          onBookingSubmit={handleBookingSubmit}
          isLoading={bookingLoading}
        />
      )}
    </div>
  )
}

export default GeneralServices
