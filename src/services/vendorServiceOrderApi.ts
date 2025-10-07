// src/services/vendorServiceOrderApi.ts
import { apiClient } from "./apiClient"
import { ENDPOINTS } from "./config"

// -------------------
// Types
// -------------------
export interface ServiceOrder {
  id: number
  user_id: number
  service_vendor_id: number
  service_pricing_id: number
  amount: string
  status: "pending_vendor_response" | "awaiting_payment" | "paid" | "completed" | "cancelled"
  notes: string | null
  deadline: string
  paid_at: string | null
  completed_at: string | null
  created_at: string
  created_at: string
  updated_at: string
  vendor_response?: string | null;
  requirements?: string;
  payment_status?: string;
  total_amount?: number;

  // Relations
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

  service_pricing: {
    id: number
    title: string
    price: number
  } | null
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
        ENDPOINTS.VENDOR_SERVICE_ORDERS,
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
    orderId: number
  ): Promise<{ message: string }> => {
    const endpoint = ENDPOINTS.SERVICE_ORDER_RESPOND.replace('{id}', orderId.toString())
    return apiClient.post<{ message: string }>(
      endpoint,
      { action: "accept" },
      true
    )
  },

  /**
   * Decline an order
   */
  declineOrder: async (
    orderId: number
  ): Promise<{ message: string }> => {
    const endpoint = ENDPOINTS.SERVICE_ORDER_RESPOND.replace('{id}', orderId.toString())
    return apiClient.post<{ message: string }>(
      endpoint,
      { action: "decline" },
      true
    )
  },
}
