// src/services/serviceOrderApi.ts
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
  updated_at: string
  vendor_response?: string | null
  requirements?: string
  payment_status?: string
  total_amount?: number

  service_vendor: {
    id: number
    vendor_id: number
    service_name: string
    description: string
    location: string
    phone: string
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
  }

  service_pricing: {
    id: number
    title: string
    price: number
  } | null

  user?: {
    id: number
    name: string
    phone: string
    email: string
    profile_picture: string | null
  }
}

export interface CreateServiceOrderData {
  service_vendor_id: number
  service_pricing_id: number
  notes: string
  deadline: string
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
      ENDPOINTS.SERVICE_ORDERS,
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
        ENDPOINTS.SERVICE_ORDERS_MY,
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
      `${ENDPOINTS.SERVICE_ORDERS}/${orderId}`,
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
      `${ENDPOINTS.SERVICE_ORDERS}/${orderId}/cancel`,
      {},
      true
    )
  },

  /**
   * Initiate payment for service order
   */
  initiatePayment: async (
    orderId: number
  ): Promise<{ status: string; data: { link: string } }> => {
    const endpoint = ENDPOINTS.SERVICE_ORDER_PAY.replace('{id}', orderId.toString())
    return apiClient.post<{ status: string; data: { link: string } }>(
      endpoint,
      {},
      true
    )
  },

  /**
   * Mark service order as completed (user)
   */
  markCompleted: async (
    orderId: number
  ): Promise<{ message: string }> => {
    const endpoint = ENDPOINTS.SERVICE_ORDER_MARK_COMPLETED.replace('{id}', orderId.toString())
    return apiClient.post<{ message: string }>(
      endpoint,
      {},
      true
    )
  },

  /**
   * Manual payment confirmation (fallback after Flutterwave redirect)
   */
  manualPaymentTrigger: async (
    paymentData: {
      data: {
        status: string
        tx_ref: string
        meta: {
          type: string
          service_order_id: number
        }
      }
    }
  ): Promise<{ status: string }> => {
    return apiClient.post<{ status: string }>(
      ENDPOINTS.FLUTTERWAVE_MANUAL_TRIGGER,
      paymentData,
      true
    )
  },
  /**
   * Confirm payment (manual trigger if webhook didn't update)
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