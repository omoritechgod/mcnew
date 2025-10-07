// src/services/orderApi.ts
import { apiClient } from './apiClient';

// ----------------------
// Types & Interfaces
// ----------------------

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string | number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    images: string[];
    thumbnail?: string;
    price: string | number;
    condition: string;
  };
}

export interface Order {
  id: number;
  user_id: number;
  vendor_id: number;
  total_amount: string | number;
  status: 'pending' | 'pending_vendor' | 'accepted' | 'awaiting_payment' | 'rejected' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  delivery_address: string;
  delivery_method: 'pickup' | 'shipping';
  created_at: string;
  updated_at: string;
  vendor?: {
    id: number;
    business_name: string;
    category: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
}

export interface CheckoutData {
  delivery_address: string;
  delivery_method: 'pickup' | 'shipping';
}

export interface CheckoutResponse {
  message: string;
  orders: Order[];
}

export interface OrderResponse {
  message?: string;
  data?: Order | Order[];
}

export interface PaymentInitResponse {
  status: string;
  data: {
    link: string;
  };
}

// ----------------------
// Order API Service
// ----------------------

export const orderApi = {
  /**
   * Checkout cart - creates orders per vendor
   */
  checkout: async (data: CheckoutData): Promise<CheckoutResponse> => {
    const response = await apiClient.post<CheckoutResponse>('/api/orders/checkout', data, true);
    
    // Normalize order amounts
    if (response.orders && Array.isArray(response.orders)) {
      response.orders = response.orders.map(normalizeOrder);
    }

    return response;
  },

  /**
   * Get user's orders
   */
  getMyOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<any>('/api/orders', true);

      // Handle paginated response
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(normalizeOrder);
      }

      // Handle direct array response
      if (Array.isArray(response)) {
        return response.map(normalizeOrder);
      }

      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  /**
   * Get single order details
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${orderId}`, true);
    return normalizeOrder(response);
  },

  /**
   * Vendor: Accept order
   */
  acceptOrder: async (orderId: number): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      `/api/vendor/orders/${orderId}/accept`,
      {},
      true
    );
  },

  /**
   * Vendor: Reject order
   */
  rejectOrder: async (orderId: number): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      `/api/vendor/orders/${orderId}/reject`,
      {},
      true
    );
  },

  /**
   * Vendor: Get vendor's orders
   */
  getVendorOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<any>('/api/vendor/orders', true);

      if (response.data && Array.isArray(response.data)) {
        return response.data.map(normalizeOrder);
      }

      if (Array.isArray(response)) {
        return response.map(normalizeOrder);
      }

      return [];
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      return [];
    }
  },

  /**
   * User: Initiate payment for order
   */
  initiatePayment: async (orderId: number): Promise<PaymentInitResponse> => {
    return apiClient.post<PaymentInitResponse>(
      `/api/orders/${orderId}/pay`,
      {},
      true
    );
  },

  /**
   * User: Mark order as completed (release escrow)
   */
  releaseEscrow: async (orderId: number): Promise<{ message: string; order: Order }> => {
    const response = await apiClient.post<{ message: string; order: Order }>(
      `/api/orders/${orderId}/release-escrow`,
      {},
      true
    );

    if (response.order) {
      response.order = normalizeOrder(response.order);
    }

    return response;
  },

  /**
   * Admin: Refund order
   */
  refundOrder: async (orderId: number): Promise<{ message: string; order: Order }> => {
    const response = await apiClient.post<{ message: string; order: Order }>(
      `/api/orders/${orderId}/refund`,
      {},
      true
    );

    if (response.order) {
      response.order = normalizeOrder(response.order);
    }

    return response;
  },

  /**
   * Vendor: Update order status (processing, shipped, delivered)
   */
  updateOrderStatus: async (
    orderId: number,
    status: 'processing' | 'shipped' | 'delivered'
  ): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(
      `/api/vendor/orders/${orderId}/status`,
      { status },
      true
    );
  },

  /**
   * Manual payment trigger (after Flutterwave redirect)
   */
  manualPaymentTrigger: async (paymentData: {
    data: {
      status: string;
      tx_ref?: string;
      meta?: {
        type: string;
        order_id: number;
      };
    };
  }): Promise<{ status: string }> => {
    return apiClient.post<{ status: string }>(
      '/api/flutterwave/manual-trigger',
      paymentData,
      true
    );
  },
};

// ----------------------
// Helper Functions
// ----------------------

/**
 * Normalize order - convert amounts to numbers
 */
function normalizeOrder(order: any): Order {
  return {
    ...order,
    total_amount: typeof order.total_amount === 'string'
      ? parseFloat(order.total_amount)
      : order.total_amount,
    items: order.items?.map((item: any) => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      product: {
        ...item.product,
        price: typeof item.product?.price === 'string'
          ? parseFloat(item.product.price)
          : item.product?.price,
        thumbnail: item.product?.thumbnail || item.product?.images?.[0] || '',
      },
    })) || [],
  };
}

// ----------------------
// Status Helpers
// ----------------------

export const getOrderStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    pending_vendor: 'bg-orange-100 text-orange-800',
    accepted: 'bg-blue-100 text-blue-800',
    awaiting_payment: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    processing: 'bg-purple-100 text-purple-800',
    paid: 'bg-green-100 text-green-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-teal-100 text-teal-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getOrderStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending Payment',
    pending_vendor: 'Awaiting Vendor',
    accepted: 'Accepted',
    awaiting_payment: 'Awaiting Payment',
    rejected: 'Rejected',
    processing: 'Processing',
    paid: 'Paid',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return labels[status] || status;
};

// ----------------------
// Export Types
// ----------------------
export type {
  Order,
  OrderItem,
  CheckoutData,
  CheckoutResponse,
  OrderResponse,
  PaymentInitResponse,
};