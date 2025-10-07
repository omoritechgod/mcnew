// src/services/cartApi.ts
import { apiClient } from './apiClient';
import { Product } from './productApi';

// ----------------------
// Types & Interfaces
// ----------------------

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    title: string;
    price: string | number;
    images: string[];
    thumbnail?: string;
    vendor_id: number;
    stock_quantity: number;
    condition: string;
    allow_pickup: boolean;
    allow_shipping: boolean;
    vendor?: {
      id: number;
      business_name: string;
      category: string;
    };
  };
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
}

export interface CartResponse {
  message?: string;
  cart?: CartItem;
  data?: CartItem[];
}

// ----------------------
// Cart API Service
// ----------------------

export const cartApi = {
  /**
   * Get user's cart items
   */
  getCart: async (): Promise<CartItem[]> => {
    try {
      const response = await apiClient.get<CartItem[] | CartResponse>('/api/cart', true);

      // Handle both array and object responses
      if (Array.isArray(response)) {
        return response.map(normalizeCartItem);
      }

      if (response.data && Array.isArray(response.data)) {
        return response.data.map(normalizeCartItem);
      }

      return [];
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  /**
   * Add product to cart
   */
  addToCart: async (data: AddToCartData): Promise<CartResponse> => {
    const response = await apiClient.post<CartResponse>('/api/cart/add', data, true);
    
    if (response.cart) {
      response.cart = normalizeCartItem(response.cart);
    }

    return response;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (cartId: number, quantity: number): Promise<CartResponse> => {
    const response = await apiClient.put<CartResponse>(
      `/api/cart/${cartId}`,
      { quantity },
      true
    );

    if (response.cart) {
      response.cart = normalizeCartItem(response.cart);
    }

    return response;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (cartId: number): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/api/cart/${cartId}`, true);
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>('/api/cart/clear', true);
  },

  /**
   * Get cart summary (total items, total price)
   */
  getCartSummary: async (): Promise<{
    totalItems: number;
    totalPrice: number;
    items: CartItem[];
  }> => {
    const items = await cartApi.getCart();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = typeof item.product.price === 'string' 
        ? parseFloat(item.product.price) 
        : item.product.price;
      return sum + (price * item.quantity);
    }, 0);

    return { totalItems, totalPrice, items };
  },
};

// ----------------------
// Helper Functions
// ----------------------

/**
 * Normalize cart item - convert price to number
 */
function normalizeCartItem(item: any): CartItem {
  return {
    ...item,
    product: {
      ...item.product,
      price: typeof item.product.price === 'string'
        ? parseFloat(item.product.price)
        : item.product.price,
      thumbnail: item.product.thumbnail || item.product.images?.[0] || '',
    },
  };
}

// ----------------------
// Export Types
// ----------------------
export type {
  CartItem,
  AddToCartData,
  CartResponse,
};