// src/services/vendorServiceOrderApi.ts
import { apiClient } from "./apiClient"

// -------------------
// Types
// -------------------
export interface VendorServiceOrder {
  id: number
  user_id: number
  service_vendor_id: number
  service_pricing_id: number
  deadline: string
  requirements: string
  status: string
  total_amount: number
  payment_status: string
  vendor_response?: string
  created_at: string
  updated_at: string

  user?: {
    id: number
    name: string
    phone: string
    email: string
  }

  service_pricing?: {
    id: number
    title: string
    price: number
  }
}

export interface VendorOrderResponse {
  data: VendorServiceOrder[]
  message?: string
}

// -------------------
// API Service
// -------------------
export const vendorServiceOrderApi = {
  /**
   * Get all service orders for the logged-in vendor
   */
  getVendorOrders: async (): Promise<VendorOrderResponse> => {
    try {
      const response = await apiClient.get<VendorOrderResponse>(
        "/api/vendor/service-orders",
        true
      )

      if (response?.data) {
        response.data = response.data.map((order: any) => ({
          ...order,
          total_amount:
            typeof order.total_amount === "string"
              ? Number.parseFloat(order.total_amount)
              : order.total_amount,
        }))
      }

      return response
    } catch (error) {
      console.error("Error fetching vendor service orders:", error)
      return { data: [] }
    }
  },

  /**
   * Accept an order
   */
  acceptOrder: async (
    orderId: number,
    responseMessage?: string
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/vendor/service-orders/${orderId}/accept`,
      { vendor_response: responseMessage },
      true
    )
  },

  /**
   * Decline an order
   */
  declineOrder: async (
    orderId: number,
    reason?: string
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/vendor/service-orders/${orderId}/decline`,
      { vendor_response: reason },
      true
    )
  },

  /**
   * Mark order as completed
   */
  completeOrder: async (
    orderId: number
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/vendor/service-orders/${orderId}/complete`,
      {},
      true
    )
  },

  /**
   * Update order status (generic)
   */
  updateOrderStatus: async (
    orderId: number,
    status: string,
    responseMessage?: string
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/vendor/service-orders/${orderId}/status`,
      { status, vendor_response: responseMessage },
      true
    )
  },
}
