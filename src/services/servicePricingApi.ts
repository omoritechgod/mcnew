// src/services/servicePricingApi.ts
import { apiClient } from "./apiClient"
import { ENDPOINTS } from "./config"

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

export interface CreateServicePricingData {
  title: string
  description?: string
  price: number
}

export interface UpdateServicePricingData {
  title?: string
  description?: string
  price?: number
}

export interface ServicePricingResponse {
  data: ServicePricing[]
  message?: string
}

// -------------------
// API Service
// -------------------
export const servicePricingApi = {
  /**
   * Get all pricings for the authenticated vendor
   */
  getMyPricings: async (): Promise<ServicePricingResponse> => {
    try {
      const response = await apiClient.get<ServicePricingResponse>(
        ENDPOINTS.VENDOR_SERVICE_PRICINGS,
        true
      )

      // Ensure price is number
      if (response?.data) {
        response.data = response.data.map((pricing: any) => ({
          ...pricing,
          price:
            typeof pricing.price === "string"
              ? Number.parseFloat(pricing.price)
              : pricing.price,
        }))
      }

      return response
    } catch (error) {
      console.error("Error fetching vendor pricings:", error)
      return { data: [] }
    }
  },

  /**
   * Create a new service pricing
   */
  createPricing: async (
    pricingData: CreateServicePricingData
  ): Promise<{ data: ServicePricing }> => {
    const response = await apiClient.post<{ data: ServicePricing }>(
      ENDPOINTS.VENDOR_SERVICE_PRICINGS,
      pricingData,
      true
    )

    // Normalize price
    if (response?.data) {
      response.data.price =
        typeof response.data.price === "string"
          ? Number.parseFloat(response.data.price)
          : response.data.price
    }

    return response
  },

  /**
   * Update a service pricing
   */
  updatePricing: async (
    pricingId: number,
    pricingData: UpdateServicePricingData
  ): Promise<{ data: ServicePricing }> => {
    const response = await apiClient.put<{ data: ServicePricing }>(
      `${ENDPOINTS.VENDOR_SERVICE_PRICINGS}/${pricingId}`,
      pricingData,
      true
    )

    // Normalize price
    if (response?.data) {
      response.data.price =
        typeof response.data.price === "string"
          ? Number.parseFloat(response.data.price)
          : response.data.price
    }

    return response
  },

  /**
   * Delete a service pricing
   */
  deletePricing: async (
    pricingId: number
  ): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(
      `${ENDPOINTS.VENDOR_SERVICE_PRICINGS}/${pricingId}`,
      true
    )
  },

  /**
   * Get specific pricing details
   */
  getPricingDetails: async (
    pricingId: number
  ): Promise<{ data: ServicePricing }> => {
    const response = await apiClient.get<{ data: ServicePricing }>(
      `${ENDPOINTS.VENDOR_SERVICE_PRICINGS}/${pricingId}`,
      true
    )

    if (response?.data) {
      response.data.price =
        typeof response.data.price === "string"
          ? Number.parseFloat(response.data.price)
          : response.data.price
    }

    return response
  },
}
