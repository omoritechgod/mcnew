"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, DollarSign } from "lucide-react"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"
import {
  servicePricingApi,
  type ServicePricing,
  type CreateServicePricingData,
} from "../../../services/servicePricingApi"

const ServicePricings: React.FC = () => {
  const [pricings, setPricings] = useState<ServicePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPricings()
  }, [])

  const fetchPricings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await servicePricingApi.getMyPricings()

      // Ensure we have an array
      const pricingsData = Array.isArray(response.data) ? response.data : []
      setPricings(pricingsData)
    } catch (err) {
      setError("Failed to fetch your service pricings")
      console.error("Error fetching pricings:", err)
      setPricings([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.price) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)

      const pricingData: CreateServicePricingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
      }

      if (editingPricing) {
        await servicePricingApi.updatePricing(editingPricing.id, pricingData)
      } else {
        await servicePricingApi.createPricing(pricingData)
      }

      await fetchPricings()
      handleCloseModal()
      alert(editingPricing ? "Pricing updated successfully!" : "Pricing created successfully!")
    } catch (error) {
      console.error("Error saving pricing:", error)
      alert("Failed to save pricing. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (pricing: ServicePricing) => {
    setEditingPricing(pricing)
    setFormData({
      title: pricing.title,
      description: pricing.description || "",
      price: pricing.price.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (pricingId: number) => {
    if (!confirm("Are you sure you want to delete this pricing?")) return

    try {
      await servicePricingApi.deletePricing(pricingId)
      await fetchPricings()
      alert("Pricing deleted successfully!")
    } catch (error) {
      console.error("Error deleting pricing:", error)
      alert("Failed to delete pricing. Please try again.")
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingPricing(null)
    setFormData({
      title: "",
      description: "",
      price: "",
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your service pricings...</p>
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Pricings</h1>
            <p className="text-gray-600">Manage your service offerings and prices</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add New Pricing
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Pricings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No service pricings yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first service pricing to start receiving orders from customers.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Pricing
              </button>
            </div>
          ) : (
            pricings.map((pricing) => (
              <div key={pricing.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{pricing.title}</h3>
                    {pricing.description && <p className="text-sm text-gray-600 mb-3">{pricing.description}</p>}
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="text-2xl font-bold text-green-600">₦{pricing.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(pricing)}
                    className="flex-1 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pricing.id)}
                    className="flex-1 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <div>Created: {new Date(pricing.created_at).toLocaleDateString()}</div>
                  <div>Updated: {new Date(pricing.updated_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingPricing ? "Edit Service Pricing" : "Add New Service Pricing"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="e.g., House Cleaning, Plumbing Repair"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      placeholder="Describe what's included in this service..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : editingPricing ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ServicePricings
