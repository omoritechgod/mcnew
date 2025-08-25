"use client"

import type React from "react"
import { useState } from "react"
import { X, Calendar, MessageSquare, CreditCard, Shield, MapPin, Star } from "lucide-react"
import type { ServiceVendor } from "../../services/serviceVendorApi"

export interface ServiceOrderData {
  service_vendor_id: number
  service_pricing_id: number
  deadline: string
  requirements: string
}

interface ServiceBookingModalProps {
  vendor: ServiceVendor
  isOpen: boolean
  onClose: () => void
  onBookingSubmit: (orderData: ServiceOrderData) => void
  isLoading: boolean
}

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  vendor,
  isOpen,
  onClose,
  onBookingSubmit,
  isLoading,
}) => {
  const [selectedPricing, setSelectedPricing] = useState<number | null>(null)
  const [deadline, setDeadline] = useState("")
  const [requirements, setRequirements] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPricing) {
      alert("Please select a service")
      return
    }

    if (!deadline) {
      alert("Please set a deadline")
      return
    }

    if (!requirements.trim()) {
      alert("Please describe your requirements")
      return
    }

    const orderData: ServiceOrderData = {
      service_vendor_id: vendor.id,
      service_pricing_id: selectedPricing,
      deadline,
      requirements: requirements.trim(),
    }

    onBookingSubmit(orderData)
  }

  const selectedPricingData = vendor.pricings.find((p) => p.id === selectedPricing)

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
            <p className="text-gray-600">{vendor.service_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vendor Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              {/* Profile picture */}
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${vendor.vendor.user.profile_picture}`}
                alt={vendor.vendor.user.name}
                className="w-12 h-12 rounded-full object-cover border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png"
                }}
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{vendor.vendor.business_name}</h3>
                <p className="text-sm text-gray-600">by {vendor.vendor.user.name}</p>
                <div className="flex items-center gap-4 text-sm mt-1">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star size={14} />
                    <span>{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin size={14} />
                    <span className="capitalize">{vendor.location}</span>
                  </div>
                </div>
                {/* 🚫 Phone number intentionally hidden — only shown in user dashboard after payment */}
              </div>

              {vendor.vendor.is_verified === 1 && (
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Shield size={12} />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Service *</label>
            <div className="space-y-3">
              {vendor.pricings.map((pricing) => (
                <div
                  key={pricing.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-colors ${
                    selectedPricing === pricing.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPricing(pricing.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="pricing"
                          value={pricing.id}
                          checked={selectedPricing === pricing.id}
                          onChange={() => setSelectedPricing(pricing.id)}
                          className="text-blue-600"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{pricing.title}</h4>
                          {pricing.description && <p className="text-sm text-gray-600">{pricing.description}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">₦{pricing.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Preferred Completion Date *
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDate}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Select when you need this service completed</p>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} className="inline mr-1" />
              Service Requirements *
            </label>
            <textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              required
              placeholder="Please describe your specific requirements, location details, and any special instructions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be as detailed as possible to help the vendor understand your needs
            </p>
          </div>

          {/* Order Summary */}
          {selectedPricingData && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedPricingData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{vendor.vendor.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium capitalize">{vendor.location}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">₦{selectedPricingData.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CreditCard size={20} className="text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Secure Escrow Payment</h4>
                <p className="text-sm text-green-700">
                  Your payment is held securely until the service is completed to your satisfaction. You'll only be
                  charged after the vendor accepts your request.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedPricing}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending Request..." : "Send Service Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceBookingModal
