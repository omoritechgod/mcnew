// src/services/vendorServiceOrderApi.ts
import { apiClient } from "./apiClient"

// -------------------
// Types
// -------------------
export interface ServiceOrder {
  id: number
  user_id: number
  service_vendor_id: number
  service_pricing_id: number
  deadline: string
  requirements: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  total_amount: number
  payment_status: "pending" | "paid" | "refunded"
  vendor_response?: string
  created_at: string
  updated_at: string

  // Relations
  user?: {
    id: number
    name: string
    phone: string
    email: string
    profile_picture?: string
  }

  service_pricing?: {
    id: number
    title: string
    price: number
  }
}

export interface ServiceOrderResponse {
  data: ServiceOrder[]
  message?: string
}

// -------------------
// Vendor Service API
// -------------------
export const vendorServiceOrderApi = {
  /**
   * Get all orders for the logged-in vendor
   */
  getMyOrders: async (): Promise<ServiceOrderResponse> => {
    try {
      const response = await apiClient.get<ServiceOrderResponse>(
        "/api/vendor/service-orders",
        true
      )

      // Normalize amounts
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
      console.error("Error fetching vendor orders:", error)
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
    return apiClient.post<{ message: string }>(
      `/api/vendor/service-orders/${orderId}/accept`,
      { vendor_response: responseMessage },
      true
    )
  },

  /**
   * Update an order status
   */
  updateOrder: async (
    orderId: number,
    updateData: { status: "in_progress" | "completed" | "cancelled" }
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/vendor/service-orders/${orderId}`,
      updateData,
      true
    )
  },
}
