// src/services/serviceOrderApi.ts
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
  status: string
  total_amount: number
  payment_status: string
  created_at: string
  updated_at: string

  service_vendor?: {
    id: number
    service_name: string
    location: string
    vendor: {
      business_name: string
      user: {
        name: string
        phone: string
      }
    }
  }

  service_pricing?: {
    id: number
    title: string
    price: number
  }
}

export interface CreateServiceOrderData {
  service_vendor_id: number
  service_pricing_id: number
  deadline: string
  requirements: string
}

export interface ServiceOrderResponse {
  data: ServiceOrder[]
  message?: string
}

// -------------------
// API Service
// -------------------
export const serviceOrderApi = {
  /**
   * Create a new service order (user)
   */
  createOrder: async (
    orderData: CreateServiceOrderData
  ): Promise<{ data: ServiceOrder }> => {
    const response = await apiClient.post<{ data: ServiceOrder }>(
      "/api/service-orders",
      orderData,
      true
    )

    // Normalize total_amount
    if (response?.data) {
      response.data.total_amount =
        typeof response.data.total_amount === "string"
          ? Number.parseFloat(response.data.total_amount)
          : response.data.total_amount
    }

    return response
  },

  /**
   * Get logged-in user's service orders
   */
  getUserOrders: async (): Promise<ServiceOrderResponse> => {
    try {
      const response = await apiClient.get<ServiceOrderResponse>(
        "/api/service-orders",
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
      console.error("Error fetching user service orders:", error)
      return { data: [] }
    }
  },

  /**
   * Get specific order details
   */
  getOrderDetails: async (
    orderId: number
  ): Promise<{ data: ServiceOrder }> => {
    const response = await apiClient.get<{ data: ServiceOrder }>(
      `/api/service-orders/${orderId}`,
      true
    )

    if (response?.data) {
      response.data.total_amount =
        typeof response.data.total_amount === "string"
          ? Number.parseFloat(response.data.total_amount)
          : response.data.total_amount
    }

    return response
  },

  /**
   * Cancel an order (user)
   */
  cancelOrder: async (
    orderId: number
  ): Promise<{ message: string }> => {
    return apiClient.patch<{ message: string }>(
      `/api/service-orders/${orderId}/cancel`,
      {},
      true
    )
  },

  /**
   * Confirm payment (manual trigger if webhook didn’t update)
   */
  confirmPayment: async (
    orderId: number,
    paymentReference: string
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      `/api/service-orders/${orderId}/confirm-payment`,
      { payment_reference: paymentReference },
      true
    )
  },
}
