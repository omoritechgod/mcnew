// src/services/serviceVendorApi.ts
import { apiClient } from "./apiClient"

// -------------------
// Types
// -------------------
export interface ServicePricing {
  id: number
  service_vendor_id: number
  title: string
  description?: string
  price: number // always number in frontend
  created_at: string
  updated_at: string
}

export interface ServiceVendor {
  id: number
  vendor_id: number
  service_name: string
  description: string
  location: string
  phone: string | null
  rating: string
  rating_count: number
  total_reviews: number
  is_featured: number
  created_at: string
  updated_at: string
  vendor: {
    id: number
    user_id: number
    vendor_type: string
    business_name: string
    category: string
    is_setup_complete: number
    is_verified: number
    created_at: string
    updated_at: string
    is_live: boolean
    user: {
      id: number
      name: string
      phone: string
      email: string
      profile_picture: string | null
      user_type: string
      status: number
      phone_verified_at: string | null
      created_at: string
      updated_at: string
    }
  }
  pricings: ServicePricing[]
  category?: string // optional frontend categorization
}

export interface ServiceVendorResponse {
  data: ServiceVendor[]
  message?: string
}

// -------------------
// API Service
// -------------------
export const serviceVendorApi = {
  /**
   * Public endpoint - get all live/verified service vendors
   */
  getPublicVendors: async (): Promise<ServiceVendorResponse> => {
    try {
      const response = await apiClient.get<any>("/api/service-vendors", false)
      console.log("Raw API response:", response)

      let vendors: ServiceVendor[] = []

      // Case 1: backend returns direct array
      if (Array.isArray(response)) {
        vendors = response.map((vendor: any) => ({
          id: vendor.id,
          vendor_id: vendor.vendor_id,
          service_name: vendor.service_name,
          description: vendor.description,
          location: vendor.location,
          phone: vendor.phone || vendor.vendor?.user?.phone || null,
          rating: vendor.rating || "0.0",
          rating_count: vendor.rating_count || 0,
          total_reviews: vendor.total_reviews || 0,
          is_featured: vendor.is_featured || 0,
          created_at: vendor.created_at,
          updated_at: vendor.updated_at,
          vendor: vendor.vendor,
          pricings: (vendor.pricings || []).map((pricing: any) => ({
            id: pricing.id,
            service_vendor_id: pricing.service_vendor_id,
            title: pricing.title,
            description: pricing.description || "",
            price:
              typeof pricing.price === "string"
                ? Number.parseFloat(pricing.price)
                : pricing.price,
            created_at: pricing.created_at,
            updated_at: pricing.updated_at,
          })),
        }))
      }

      // Case 2: nested { data: [] }
      else if (response?.data && Array.isArray(response.data)) {
        vendors = response.data.map((vendor: any) => ({
          id: vendor.id,
          vendor_id: vendor.vendor_id,
          service_name: vendor.service_name,
          description: vendor.description,
          location: vendor.location,
          phone: vendor.phone || vendor.vendor?.user?.phone || null,
          rating: vendor.rating || "0.0",
          rating_count: vendor.rating_count || 0,
          total_reviews: vendor.total_reviews || 0,
          is_featured: vendor.is_featured || 0,
          created_at: vendor.created_at,
          updated_at: vendor.updated_at,
          vendor: vendor.vendor,
          pricings: (vendor.pricings || []).map((pricing: any) => ({
            id: pricing.id,
            service_vendor_id: pricing.service_vendor_id,
            title: pricing.title,
            description: pricing.description || "",
            price:
              typeof pricing.price === "string"
                ? Number.parseFloat(pricing.price)
                : pricing.price,
            created_at: pricing.created_at,
            updated_at: pricing.updated_at,
          })),
        }))
      }

      console.log("Processed vendors:", vendors)
      return { data: vendors }
    } catch (error) {
      console.error("Error fetching public vendors:", error)
      return { data: [] }
    }
  },

  /**
   * Get details of a specific vendor
   */
  getVendorDetails: async (
    vendorId: number
  ): Promise<{ data: ServiceVendor }> => {
    try {
      const response = await apiClient.get<{ data: ServiceVendor }>(
        `/api/service-vendors/${vendorId}`,
        false
      )
      return response
    } catch (error) {
      console.error(`Error fetching vendor details [${vendorId}]:`, error)
      throw error
    }
  },
}
